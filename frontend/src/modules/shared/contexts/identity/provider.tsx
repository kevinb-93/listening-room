import React, { useEffect } from 'react';
import { IdentityContext } from './context';
import { IdentityContextInterface } from './types';
import { __useIdentityReducer, actions } from './reducer';

let logoutTimer: number;

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

        // restore token on first load

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

    React.useEffect(() => {
        if (state.token && state.tokenExpirationDate) {
            const remainingTime =
                state.tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(
                actions.auth.logout(dispatch),
                remainingTime
            );
        } else {
            clearTimeout(logoutTimer);
        }
    }, [state.token, state.tokenExpirationDate, dispatch]);

    return (
        <IdentityContext.Provider value={value}>
            {children}
        </IdentityContext.Provider>
    );
};
