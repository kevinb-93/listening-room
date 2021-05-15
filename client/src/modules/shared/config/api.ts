import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import {
    setLocalStorage,
    LocalStorageItemNames,
    getLocalStorage,
    removeLocalStorage
} from '../utils/local-storage';

type ApiRequestConfig = AxiosRequestConfig & { _retry?: boolean };

export const baseUrl = 'https://qsong.com:5000';
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

export const isRefreshTokenUrl = (url = '') => {
    return url === refreshTokenUrl;
};

const refreshToken = (requestConfig: ApiRequestConfig) => {
    requestConfig._retry = true;

    return api({
        url: refreshTokenUrl,
        withCredentials: true,
        method: 'POST'
    }).then(res => {
        if (res.status === 200) {
            setLocalStorage(LocalStorageItemNames.User, {
                userToken: res.data.accessToken
            });
        }
        return api(requestConfig);
    });
};

interface CheckRefreshTokenParams {
    error: AxiosError;
    requestConfig: ApiRequestConfig;
}

const shouldRefreshToken = ({
    error,
    requestConfig
}: CheckRefreshTokenParams) =>
    error.response?.status === 401 &&
    !isRefreshTokenUrl(requestConfig.url) &&
    error.response.data.code === 1 &&
    !requestConfig._retry;

const errorInterceptor = (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    if (
        shouldRefreshToken({
            error,
            requestConfig: error.config
        })
    ) {
        return refreshToken(error.config);
    } else if (isRefreshTokenUrl(error.config.url)) {
        removeLocalStorage(LocalStorageItemNames.User);
    }

    return Promise.reject(error);
};

api.interceptors.response.use(
    response => response,
    error => errorInterceptor(error)
);

export default api;
