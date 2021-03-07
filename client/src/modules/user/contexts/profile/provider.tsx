import React, { useCallback, useEffect } from 'react';

import { UserProfileContext } from './context';
import { UserProfileContextInterface } from './types';
import { __useUserProfileReducer } from './reducer';
import { useUserIdentityContext } from '../identity';
import { useApiRequest } from '../../../shared/hooks/use-api-request';
import { UserProfileReducerActionType } from './reducer/types';

export const Provider: React.FC = ({ children }) => {
    const { userToken } = useUserIdentityContext();
    const { sendRequest } = useApiRequest();

    const [state, dispatch] = __useUserProfileReducer();

    const value: UserProfileContextInterface = {
        ...state,
        dispatch
    };

    const loadProfile = useCallback(async () => {
        try {
            const { data, status } = await sendRequest('/user', {});

            if (status === 200) {
                dispatch({
                    type: UserProfileReducerActionType.SetProfile,
                    payload: data.user
                });
            }
        } catch (e) {
            console.error(e);
        }
    }, [dispatch, sendRequest]);

    useEffect(() => {
        if (userToken) {
            loadProfile();
        }
    }, [loadProfile, userToken]);

    return (
        <UserProfileContext.Provider value={value}>
            {children}
        </UserProfileContext.Provider>
    );
};
