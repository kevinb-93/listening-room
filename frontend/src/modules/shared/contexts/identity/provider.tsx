import React, { useCallback, useEffect } from 'react';
import { IdentityContext } from './context';
import { IdentityContextInterface } from './types';
import { __useIdentityReducer, actions } from './reducer';
import { useApiRequest } from '../../hooks/api-hook';

let userLogoutTimer: number;
let spotifyRefreshTokenTimer: number;

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useIdentityReducer();
    const { sendRequest } = useApiRequest();

    const value: IdentityContextInterface = {
        ...state,
        actions: {
            login: (token, expirationDate) =>
                actions.auth.login(dispatch, { token, expirationDate }),
            logout: () => actions.auth.logout(dispatch),
            spotifyLogin: (
                spotifyToken,
                spotifyRefreshToken,
                spotifyExpirationDate
            ) =>
                actions.auth.spotifyLogin(dispatch, {
                    spotifyToken,
                    spotifyRefreshToken,
                    spotifyExpirationDate,
                }),
        },
    };

    useEffect(() => {
        const storeduser = JSON.parse(localStorage.getItem('ls_user'));

        // restore token on first load
        console.log('checking restore token...');

        if (
            storeduser?.token &&
            storeduser?.expiration &&
            new Date(storeduser?.expiration) > new Date()
        ) {
            actions.auth.login(dispatch, {
                token: storeduser.token,
                expirationDate: new Date(storeduser.expiration),
            });
        }

        const storedSpotify = JSON.parse(localStorage.getItem('ls_spotify'));

        if (
            storedSpotify?.spotifyToken &&
            storedSpotify?.spotifyRefreshToken &&
            new Date(storedSpotify?.spotifyExpirationDate) > new Date()
        ) {
            actions.auth.spotifyLogin(dispatch, {
                spotifyToken: storedSpotify.spotifyToken,
                spotifyRefreshToken: storedSpotify.spotifyRefreshToken,
                spotifyExpirationDate: new Date(
                    storedSpotify.spotifyExpirationDate
                ),
            });
        }
    }, [dispatch]);

    const refreshSpotifyToken = useCallback(() => {
        const refreshToken = async () => {
            try {
                const response = await sendRequest(
                    'http://localhost:5000/api/spotify/refresh_token',
                    {
                        params: { refresh_token: state.spotifyRefreshToken },
                    }
                );

                const expirationDate = new Date(
                    new Date().getTime() + 1000 * response.data.expires_in
                );

                actions.auth.spotifyLogin(dispatch, {
                    spotifyToken: response.data.access_token,
                    spotifyRefreshToken: state.spotifyRefreshToken,
                    spotifyExpirationDate: expirationDate,
                });
            } catch (e) {
                console.log(e);
            }
        };
        refreshToken();
    }, [dispatch, sendRequest, state.spotifyRefreshToken]);

    React.useEffect(() => {
        console.log('checking user token remaining time...');
        if (state.token && state.tokenExpirationDate) {
            const remainingTime =
                state.tokenExpirationDate.getTime() - new Date().getTime();
            userLogoutTimer = setTimeout(
                () => actions.auth.logout(dispatch),
                remainingTime
            );
        } else {
            clearTimeout(userLogoutTimer);
        }
    }, [state.token, state.tokenExpirationDate, dispatch]);

    React.useEffect(() => {
        console.log('checking spotify token remaining time...');
        if (
            state.spotifyToken &&
            state.spotifyRefreshToken &&
            state.spotifyExpirationDate
        ) {
            const remainingTime =
                state.spotifyExpirationDate.getTime() - new Date().getTime();
            spotifyRefreshTokenTimer = setTimeout(
                () => refreshSpotifyToken(),
                remainingTime
            );
        } else {
            clearTimeout(spotifyRefreshTokenTimer);
        }
    }, [
        state.spotifyToken,
        state.spotifyRefreshToken,
        state.spotifyExpirationDate,
        refreshSpotifyToken,
        dispatch,
    ]);

    return (
        <IdentityContext.Provider value={value}>
            {children}
        </IdentityContext.Provider>
    );
};
