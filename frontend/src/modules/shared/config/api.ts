import axios, { AxiosRequestConfig } from 'axios';
import {
    setLocalStorage,
    LocalStorageItemNames,
    getLocalStorage,
    removeLocalStorage
} from '../utils/local-storage';

type RequestConfig = Record<string, unknown>;

export const baseUrl = 'http://localhost:5000';
const refreshTokenUrl = `${baseUrl}/api/user/refresh-token`;

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

const isRefreshTokenRequest = (requestConfig: RequestConfig) => {
    return requestConfig.url === refreshTokenUrl;
};

const refreshToken = (requestConfig: RequestConfig) => {
    requestConfig._retry = true;
    return api.post(refreshTokenUrl).then(res => {
        if (res.status === 200) {
            setLocalStorage(LocalStorageItemNames.User, {
                userToken: res.data.accessToken
            });
        }
        return api(requestConfig);
    });
};

interface CheckRefreshTokenParams {
    status: number;
    requestConfig: RequestConfig;
}

const shouldRefreshToken = ({
    status,
    requestConfig
}: CheckRefreshTokenParams) =>
    status === 401 &&
    !isRefreshTokenRequest(requestConfig) &&
    !requestConfig._retry;

const errorInterceptor = (error: {
    config: RequestConfig;
    response: { status: number };
}) => {
    const originalRequest = error.config;

    if (
        shouldRefreshToken({
            status: error.response.status,
            requestConfig: originalRequest
        })
    ) {
        return refreshToken(originalRequest);
    } else if (isRefreshTokenRequest(originalRequest)) {
        removeLocalStorage(LocalStorageItemNames.User);
    }

    return Promise.reject(error);
};

api.interceptors.response.use(
    response => response,
    error => errorInterceptor(error)
);

export default api;
