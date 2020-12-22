import React, { useCallback, useEffect } from 'react';
import { UserIdentityContext } from './context';
import { UserIdentityContextInterface, User } from './types';
import { __useUserIdentityReducer } from './reducer';
import { useApiRequest } from '../../hooks/api-hook';
import { baseUrl } from '../../config/api';
import {
    getLocalStorage,
    LocalStorageItemNames,
    removeLocalStorage
} from '../../utils/local-storage';
import useActions from './useActions';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useUserIdentityReducer();

    const { sendRequest, error, clearError } = useApiRequest();

    const { userLogin, userLogout, setRestoreState } = useActions(
        state,
        dispatch
    );

    const value: UserIdentityContextInterface = {
        ...state,
        userLogin,
        userLogout,
        setRestoreState
    };

    const restoreUserToken = useCallback(async () => {
        try {
            const { userToken, userRefreshToken } =
                getLocalStorage(LocalStorageItemNames.User) || {};

            if (!userToken || !userRefreshToken) {
                setRestoreState(false);
                return;
            }

            console.log('restoring token...');

            const response = await sendRequest(`${baseUrl}/api/user`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            const user: User = {
                userId: response.data.user._id,
                userType: response.data.user.userType
            };

            userLogin(userToken, userRefreshToken, user);
        } catch (e) {
            setRestoreState(false);
        }
    }, [sendRequest, setRestoreState, userLogin]);

    useEffect(() => {
        restoreUserToken();
    }, [dispatch, restoreUserToken]);

    useEffect(() => {
        if (error) {
            removeLocalStorage(LocalStorageItemNames.User);
            setRestoreState(false);
            clearError();
        }
    }, [clearError, error, setRestoreState]);

    return (
        <UserIdentityContext.Provider value={value}>
            {children}
        </UserIdentityContext.Provider>
    );
};
