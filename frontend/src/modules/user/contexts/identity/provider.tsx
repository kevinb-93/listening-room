import React, { useCallback, useEffect } from 'react';
import { UserIdentityContext } from './context';
import { UserIdentityContextInterface } from './types';
import { __useUserIdentityReducer } from './reducer';
import {
    getLocalStorage,
    LocalStorageItemNames
} from '../../../shared/utils/local-storage';
import useActions from './useActions';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useUserIdentityReducer();

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

            userLogin(userToken, userRefreshToken);
        } catch (e) {
            setRestoreState(false);
        }
    }, [setRestoreState, userLogin]);

    useEffect(() => {
        restoreUserToken();
    }, [dispatch, restoreUserToken]);

    return (
        <UserIdentityContext.Provider value={value}>
            {children}
        </UserIdentityContext.Provider>
    );
};
