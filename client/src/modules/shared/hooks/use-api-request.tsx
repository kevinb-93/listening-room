import { useState, useCallback, useEffect } from 'react';
import { AxiosError, AxiosRequestConfig } from 'axios';

import axios, { isRefreshTokenUrl } from '../config/api';
import { useUserIdentityContext } from '../../../modules/user/contexts/identity';
import { IdentityReducerActionType } from '../../../modules/user/contexts/identity/reducer/types';

type ApiError = Error | AxiosError | undefined;

const isAxiosError = (error: AxiosError | unknown): error is AxiosError =>
    (error as AxiosError)?.isAxiosError;

export const useApiRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiError>();
    const { dispatch } = useUserIdentityContext();

    // const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(
        async (url: string, requestConfig: AxiosRequestConfig = {}) => {
            setIsLoading(true);
            // const httpAbortCtrl = new AbortController();
            // activeHttpRequests.current.push(httpAbortCtrl);

            try {
                // const response = await fetch(url, {
                //     method,
                //     body,
                //     headers,
                //     signal: httpAbortCtrl.signal,
                // });

                const response = await axios({
                    url,
                    ...requestConfig
                });

                // activeHttpRequests.current = activeHttpRequests.current.filter(
                //     (reqCtrl) => reqCtrl !== httpAbortCtrl
                // );

                // if (!response.status) {
                //     throw new Error(responseData.message);
                // }

                setIsLoading(false);
                return response;
            } catch (err) {
                if (isAxiosError(err)) {
                    setError(err);
                }

                setIsLoading(false);
                throw err;
            }
        },
        []
    );

    const clearError = () => {
        setError(undefined);
    };

    useEffect(
        function refreshTokenErrorEffect() {
            if (!isAxiosError(error)) return;
            if (!isRefreshTokenUrl(error.config.url)) return;

            dispatch({
                type: IdentityReducerActionType.userLogout,
                payload: null
            });
        },
        [dispatch, error]
    );

    // useEffect(() => {
    //     return () => {
    //         activeHttpRequests.current.forEach((abortCtrl) =>
    //             abortCtrl.abort()
    //         );
    //     };
    // }, []);

    const getErrorMessage = (error: ApiError) => {
        if (!error) return '';

        if (isAxiosError(error) && error.response?.data?.message) {
            return error.response.data.message;
        }

        return error.message;
    };

    return {
        isLoading,
        error: getErrorMessage(error),
        sendRequest,
        clearError
    };
};
