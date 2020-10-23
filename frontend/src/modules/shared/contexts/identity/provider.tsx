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
            spotifyLogin: (spotifyToken, spotifyRefreshToken) =>
                actions.auth.spotifyLogin(dispatch, {
                    spotifyToken,
                    spotifyRefreshToken,
                }),
        },
    };

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));

        // restore token on first load
        console.log('checking restore token...');

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

        if (storedData?.spotifyToken && storedData?.spotifyRefreshToken) {
            actions.auth.spotifyLogin(dispatch, {
                spotifyToken: storedData.spotifyToken,
                spotifyRefreshToken: storedData.spotifyRefreshToken,
            });
        }
    }, [dispatch]);

    React.useEffect(() => {
        console.log('checking token remaining time...');
        if (state.token && state.tokenExpirationDate) {
            const remainingTime =
                state.tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(
                () => actions.auth.logout(dispatch),
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
