import axios, { AxiosRequestConfig } from 'axios';
import {
    setLocalStorage,
    LocalStorageItemNames,
    getLocalStorage
} from '../utils/local-storage';

export const baseUrl = 'http://localhost:5000';

const api = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
        'Content-Type': 'application/json'
    },
    responseType: 'json'
});

const addAuthHeader = (config: AxiosRequestConfig) => {
    const { userToken } = getLocalStorage(LocalStorageItemNames.User) || {};

    if (userToken) {
        config.headers['Authorization'] = `Bearer ${userToken}`;
    }
    return config;
};

api.interceptors.request.use(
    config => addAuthHeader(config),
    error => {
        Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        const { userRefreshToken } =
            getLocalStorage(LocalStorageItemNames.User) || {};
        if (
            userRefreshToken &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            return api
                .post(`${baseUrl}/api/user/refresh-token`, {
                    refreshToken: userRefreshToken
                })
                .then(res => {
                    if (res.status === 200) {
                        setLocalStorage(LocalStorageItemNames.User, {
                            userToken: res.data.accessToken,
                            userRefreshToken
                        });
                        return api(originalRequest);
                    }
                });
        }
        return Promise.reject(error);
    }
);

export default api;
