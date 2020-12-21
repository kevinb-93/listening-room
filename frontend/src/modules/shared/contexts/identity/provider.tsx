import React, { useCallback, useEffect } from 'react';
import { IdentityContext } from './context';
import { IdentityContextInterface, User } from './types';
import { __useIdentityReducer, actions } from './reducer';
import { useApiRequest } from '../../hooks/api-hook';
import { baseUrl } from '../../config/api';
import {
    getLocalStorage,
    LocalStorageItemNames,
    removeLocalStorage
} from '../../utils/local-storage';
import useActions from './useActions';

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

    const {
        isLoggedIn,
        login,
        logout,
        setRestoreState,
        spotifyLogin
    } = useActions(state, dispatch);

    const value: IdentityContextInterface = {
        ...state,
        login,
        logout,
        spotifyLogin,
        isLoggedIn,
        setRestoreState
    };

    const restoreUserToken = useCallback(async () => {
        try {
            const { token, refreshToken } =
                getLocalStorage(LocalStorageItemNames.User) || {};

            if (!token || !refreshToken) {
                setRestoreState(false);
                return;
            }

            console.log('restoring token...');

            const response = await sendRestoreUserRequest(
                `${baseUrl}/api/user`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const user: User = {
                userId: response.data.user._id,
                userType: response.data.user.userType
            };

            login(token, refreshToken, user);
        } catch (e) {
            throw new Error(e);
        }
    }, [login, sendRestoreUserRequest, setRestoreState]);

    const restoreSpotifyToken = useCallback(async () => {
        try {
            const { spotifyToken, spotifyRefreshToken, spotifyExpirationDate } =
                getLocalStorage(LocalStorageItemNames.Spotify) || {};

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
            throw new Error(e);
        }
    }, [dispatch]);

    useEffect(() => {
        const restoreTokens = async () => {
            try {
                restoreUserToken();
                restoreSpotifyToken();
            } catch (e) {
                // console.error(e);
                setRestoreState(false);
            }
        };
        restoreTokens();
    }, [
        dispatch,
        restoreSpotifyToken,
        restoreUserToken,
        sendRestoreUserRequest,
        setRestoreState
    ]);

    useEffect(() => {
        if (restoreUserError) {
            removeLocalStorage(LocalStorageItemNames.User);
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
