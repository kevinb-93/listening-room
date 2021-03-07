import React, { useCallback, useEffect } from 'react';
import { UserIdentityContext } from './context';
import { UserIdentityContextInterface } from './types';
import { __useUserIdentityReducer } from './reducer';
import {
    getLocalStorage,
    LocalStorageItemNames
} from '../../../shared/utils/local-storage';
import useActions from './useActions';
import { IdentityReducerActionType } from './reducer/types';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useUserIdentityReducer();

    const { userLogout, setRestoreState } = useActions(state, dispatch);

    const value: UserIdentityContextInterface = {
        ...state,
        dispatch,
        userLogout,
        setRestoreState
    };

    const restoreUserToken = useCallback(async () => {
        try {
            const { userToken } =
                getLocalStorage(LocalStorageItemNames.User) || {};

            if (!userToken) {
                return setRestoreState(false);
            }

            dispatch({
                type: IdentityReducerActionType.userLogin,
                payload: { userToken }
            });
        } catch (e) {
            setRestoreState(false);
        }
    }, [dispatch, setRestoreState]);

    useEffect(() => {
        restoreUserToken();
    }, [dispatch, restoreUserToken]);

    return (
        <UserIdentityContext.Provider value={value}>
            {children}
        </UserIdentityContext.Provider>
    );
};
