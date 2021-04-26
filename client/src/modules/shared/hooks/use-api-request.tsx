import { useState, useCallback } from 'react';
import { AxiosRequestConfig } from 'axios';

import axios from '../config/api';

export const useApiRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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
                if (err instanceof Error) {
                    setError(err.message);
                }

                setIsLoading(false);
                throw err;
            }
        },
        []
    );

    const clearError = () => {
        setError('');
    };

    // useEffect(() => {
    //     return () => {
    //         activeHttpRequests.current.forEach((abortCtrl) =>
    //             abortCtrl.abort()
    //         );
    //     };
    // }, []);

    return { isLoading, error, sendRequest, clearError };
};
