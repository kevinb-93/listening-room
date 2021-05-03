import React, { useCallback, useEffect } from 'react';
import { UserIdentityContext } from './context';
import { UserIdentityContextInterface } from './types';
import { __useUserIdentityReducer } from './reducer';
import {
    getLocalStorage,
    LocalStorageItemNames
} from '../../../shared/utils/local-storage';
import { IdentityReducerActionType } from './reducer/types';
import { baseUrl } from '../../../../modules/shared/config/api';
import { useApiRequest } from '../../../../modules/shared/hooks/use-api-request';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useUserIdentityReducer();
    const { sendRequest: sendLogoutRequest } = useApiRequest();

    const userLogout = useCallback(async () => {
        try {
            await sendLogoutRequest(`${baseUrl}/api/user/logout`, {
                method: 'DELETE'
            });
        } catch (e) {
            console.error(e);
        } finally {
            dispatch({
                type: IdentityReducerActionType.userLogout,
                payload: null
            });
        }
    }, [dispatch, sendLogoutRequest]);

    const value: UserIdentityContextInterface = {
        ...state,
        dispatch,
        userLogout
    };

    const restoreUserToken = useCallback(async () => {
        try {
            const { userToken } =
                getLocalStorage(LocalStorageItemNames.User) || {};

            if (!userToken) {
                return dispatch({
                    type: IdentityReducerActionType.restoreState,
                    payload: false
                });
            }

            dispatch({
                type: IdentityReducerActionType.userLogin,
                payload: { userToken }
            });
        } catch (e) {
            dispatch({
                type: IdentityReducerActionType.restoreState,
                payload: false
            });
        }
    }, [dispatch]);

    useEffect(() => {
        restoreUserToken();
    }, [dispatch, restoreUserToken]);

    return (
        <UserIdentityContext.Provider value={value}>
            {children}
        </UserIdentityContext.Provider>
    );
};
