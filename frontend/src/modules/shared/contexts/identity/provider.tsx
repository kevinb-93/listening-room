import React, { useEffect } from 'react';
import { IdentityContext } from './context';
import { IdentityContextInterface } from './types';
import { __useIdentityReducer, actions } from './reducer';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useIdentityReducer();

    const value: IdentityContextInterface = {
        ...state,
        actions: {
            login: (token, expirationDate) =>
                actions.auth.login(dispatch, { token, expirationDate }),
            logout: () => actions.auth.logout(dispatch),
            spotifyLogin: (spotifyToken) =>
                actions.auth.spotifyLogin(dispatch, { spotifyToken }),
        },
    };

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));

        if (
            storedData?.token &&
            storedData?.expiration &&
            new Date(storedData?.expiration) > new Date()
        ) {
            actions.auth.login(dispatch, {
                token: storedData.token,
                expirationDate: new Date(storedData.expiration),
            });
        }
    }, [dispatch]);

    return (
        <IdentityContext.Provider value={value}>
            {children}
        </IdentityContext.Provider>
    );
};
