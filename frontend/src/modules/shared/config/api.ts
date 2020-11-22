import axios from 'axios';
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

//request interceptor to add the auth token header to requests
axios.interceptors.request.use(
    config => {
        const { token } = getLocalStorage(LocalStorageItemNames.User);

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

//response interceptor to refresh token on receiving token expired error
axios.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        const { refreshToken } = getLocalStorage(LocalStorageItemNames.User);
        if (
            refreshToken &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            return api
                .post(`${baseUrl}/api/refresh-token`, {
                    refreshToken
                })
                .then(res => {
                    if (res.status === 200) {
                        setLocalStorage(LocalStorageItemNames.User, {
                            token: res.data.token,
                            refreshToken
                        });
                        console.log('Access token refreshed!');
                        return axios(originalRequest);
                    }
                });
        }
        return Promise.reject(error);
    }
);

export default api;
