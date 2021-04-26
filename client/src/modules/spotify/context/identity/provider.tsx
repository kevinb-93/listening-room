import React, { useCallback, useEffect } from 'react';
import { SpotifyIdentityContext } from './context';
import { SpotifyIdentityContextInterface } from './types';
import { __useSpotifyIdentityReducer } from './reducer';
import { useApiRequest } from '../../../shared/hooks/use-api-request';
import { baseUrl } from '../../../shared/config/api';
import {
    getLocalStorage,
    LocalStorageItemNames,
    removeLocalStorage,
    setLocalStorage
} from '../../../shared/utils/local-storage';
import { SpotifyIdentityReducerActionType } from './reducer/types';
import SpotifyWebApi from 'spotify-web-api-js';

let spotifyRefreshTokenTimer: number;

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyIdentityReducer();

    const { sendRequest } = useApiRequest();

    const loginSpotify = useCallback<
        SpotifyIdentityContextInterface['loginSpotify']
    >(
        (spotifyToken, spotifyRefreshToken, spotifyExpirationDate) => {
            dispatch({
                type: SpotifyIdentityReducerActionType.spotifyLogin,
                payload: {
                    spotifyExpirationDate,
                    spotifyRefreshToken,
                    spotifyToken
                }
            });
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(spotifyToken);

            setLocalStorage(LocalStorageItemNames.Spotify, {
                spotifyToken,
                spotifyRefreshToken,
                spotifyExpirationDate
            });
        },
        [dispatch]
    );

    const logoutSpotify = useCallback(() => {
        dispatch({
            type: SpotifyIdentityReducerActionType.spotifyLogout,
            payload: null
        });
        removeLocalStorage(LocalStorageItemNames.Spotify);
    }, [dispatch]);

    const value: SpotifyIdentityContextInterface = {
        ...state,
        dispatch,
        loginSpotify,
        logoutSpotify
    };

    const restoreSpotifyToken = useCallback(async () => {
        try {
            const { spotifyToken, spotifyRefreshToken, spotifyExpirationDate } =
                getLocalStorage(LocalStorageItemNames.Spotify) || {};

            if (!spotifyToken || !spotifyRefreshToken || !spotifyExpirationDate)
                return;

            if (new Date(spotifyExpirationDate) > new Date()) {
                console.log('restoring spotify token...');
                loginSpotify(
                    spotifyToken,
                    spotifyRefreshToken,
                    new Date(spotifyExpirationDate)
                );
            }
        } catch (e) {
            dispatch({
                type: SpotifyIdentityReducerActionType.restoreState,
                payload: false
            });
        }
    }, [dispatch, loginSpotify]);

    useEffect(() => {
        restoreSpotifyToken();
    }, [dispatch, restoreSpotifyToken]);

    const refreshSpotifyToken = useCallback(async () => {
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

            loginSpotify(
                response.data.access_token,
                state.spotifyRefreshToken,
                expirationDate
            );
        } catch (e) {
            console.error(e);
        }
    }, [loginSpotify, sendRequest, state.spotifyRefreshToken]);

    React.useEffect(() => {
        console.log('checking spotify token remaining time...');
        if (
            state.spotifyToken &&
            state.spotifyRefreshToken &&
            state.spotifyExpirationDate
        ) {
            const remainingTime =
                state.spotifyExpirationDate.getTime() - new Date().getTime();
            spotifyRefreshTokenTimer = window.setTimeout(
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
        <SpotifyIdentityContext.Provider value={value}>
            {children}
        </SpotifyIdentityContext.Provider>
    );
};
