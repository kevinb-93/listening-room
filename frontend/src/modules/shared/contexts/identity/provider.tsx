import React, { useCallback, useEffect } from 'react';
import { IdentityContext } from './context';
import { IdentityContextInterface, UserType } from './types';
import { __useIdentityReducer, actions } from './reducer';
import { useApiRequest } from '../../hooks/api-hook';
import { baseUrl } from '../../config/api';
import {
    getLocalStorage,
    LocalStorageItemNames
} from '../../utils/local-storage';

// let userLogoutTimer: number;
let spotifyRefreshTokenTimer: number;

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useIdentityReducer();
    const { sendRequest } = useApiRequest();
    const {
        sendRequest: sendRestoreUserRequest,
        error: restoreUserError,
        clearError: clearRestoreUserError
    } = useApiRequest();
    const { sendRequest: sendLogoutRequest } = useApiRequest();

    const isLoggedIn = useCallback(() => {
        if (!state.token || !state.user?.userType) {
            return false;
        }

        if (state.user?.userType === UserType.Host && !state.spotifyToken) {
            return false;
        }

        return true;
    }, [state.spotifyToken, state.token, state.user?.userType]);

    const login = useCallback<IdentityContextInterface['login']>(
        (token, refreshToken, user) =>
            actions.auth.login(dispatch, {
                token,
                refreshToken,
                user
            }),
        [dispatch]
    );

    const logout = useCallback(() => {
        actions.auth.logout(dispatch);
        sendLogoutRequest(`${baseUrl}/api/user/logout`, {
            method: 'DELETE',
            data: { refreshToken: state.refreshToken }
        });
    }, [dispatch, sendLogoutRequest, state.refreshToken]);

    const spotifyLogin = useCallback(
        (spotifyToken, spotifyRefreshToken, spotifyExpirationDate) =>
            actions.auth.spotifyLogin(dispatch, {
                spotifyToken,
                spotifyRefreshToken,
                spotifyExpirationDate
            }),
        [dispatch]
    );

    const setRestoreState = useCallback(
        state => {
            actions.auth.restoreState(dispatch, { restoreState: state });
        },
        [dispatch]
    );

    const value: IdentityContextInterface = {
        ...state,
        login,
        logout,
        spotifyLogin,
        isLoggedIn,
        setRestoreState
    };

    useEffect(() => {
        const restoreToken = async () => {
            try {
                // restore user token
                const { token, refreshToken } = getLocalStorage(
                    LocalStorageItemNames.User
                );

                if (token && refreshToken) {
                    console.log('restoring token...');

                    const response = await sendRestoreUserRequest(
                        `${baseUrl}/api/user`,
                        {}
                    );

                    actions.auth.login(dispatch, {
                        token,
                        refreshToken,
                        user: {
                            userId: response.data._id,
                            userType: response.data.user.userType
                        }
                    });
                } else {
                    setRestoreState(false);
                    return;
                }

                // restore spotify token
                const {
                    spotifyToken,
                    spotifyRefreshToken,
                    spotifyExpirationDate
                } = getLocalStorage(LocalStorageItemNames.Spotify);

                if (
                    spotifyToken &&
                    spotifyRefreshToken &&
                    new Date(spotifyExpirationDate) > new Date()
                ) {
                    console.log('restoring spotify token');
                    actions.auth.spotifyLogin(dispatch, {
                        spotifyToken,
                        spotifyRefreshToken,
                        spotifyExpirationDate: new Date(spotifyExpirationDate)
                    });
                }
            } catch (e) {
                console.error(e);
                setRestoreState(false);
            }
        };
        restoreToken();
    }, [dispatch, sendRestoreUserRequest, setRestoreState]);

    useEffect(() => {
        if (restoreUserError) {
            setRestoreState(false);
            clearRestoreUserError();
        }
    }, [clearRestoreUserError, restoreUserError, setRestoreState]);

    const refreshSpotifyToken = useCallback(() => {
        const refreshToken = async () => {
            try {
                const response = await sendRequest(
                    `${baseUrl}/api/spotify/refresh_token`,
                    {
                        params: { refresh_token: state.spotifyRefreshToken }
                    }
                );

                const expirationDate = new Date(
                    new Date().getTime() + 1000 * response.data.expires_in
                );

                actions.auth.spotifyLogin(dispatch, {
                    spotifyToken: response.data.access_token,
                    spotifyRefreshToken: state.spotifyRefreshToken,
                    spotifyExpirationDate: expirationDate
                });
            } catch (e) {
                console.log(e);
            }
        };
        refreshToken();
    }, [dispatch, sendRequest, state.spotifyRefreshToken]);

    // React.useEffect(() => {
    //     console.log('checking user token remaining time...');
    //     if (state.token && state.tokenExpirationDate) {
    //         const remainingTime =
    //             state.tokenExpirationDate.getTime() - new Date().getTime();
    //         userLogoutTimer = setTimeout(
    //             () => actions.auth.logout(dispatch),
    //             remainingTime
    //         );
    //     } else {
    //         clearTimeout(userLogoutTimer);
    //     }
    // }, [state.token, state.tokenExpirationDate, dispatch]);

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
        dispatch
    ]);

    return (
        <IdentityContext.Provider value={value}>
            {children}
        </IdentityContext.Provider>
    );
};
