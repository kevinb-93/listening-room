import React, { useCallback, useEffect } from 'react';

import { UserProfileContext } from './context';
import { UserProfileContextInterface } from './types';
import { __useUserProfileReducer } from './reducer';
import useActions from './useActions';
import { useUserIdentityContext } from '../identity';
import { useApiRequest } from '../../../shared/hooks/api-hook';

export const Provider: React.FC = ({ children }) => {
    const { userToken } = useUserIdentityContext();
    const { sendRequest } = useApiRequest();

    const [state, dispatch] = __useUserProfileReducer();
    const { set } = useActions(state, dispatch);

    const value: UserProfileContextInterface = {
        ...state,
        set
    };

    const loadProfile = useCallback(async () => {
        try {
            const { data } = await sendRequest('/user', {});
            set({
                partyId: data.user.party,
                userId: data.user._id,
                userType: data.user.userType
            });
        } catch (e) {
            console.error(e);
        }
    }, [sendRequest, set]);

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
