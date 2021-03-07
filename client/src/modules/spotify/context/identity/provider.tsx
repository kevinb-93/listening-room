import React, { useCallback, useEffect } from 'react';
import { SpotifyIdentityContext } from './context';
import { SpotifyIdentityContextInterface } from './types';
import { __useSpotifyIdentityReducer, actions } from './reducer';
import { useApiRequest } from '../../../shared/hooks/use-api-request';
import { baseUrl } from '../../../shared/config/api';
import {
    getLocalStorage,
    LocalStorageItemNames
} from '../../../shared/utils/local-storage';
import useActions from './useActions';

let spotifyRefreshTokenTimer: number;

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyIdentityReducer();

    const { sendRequest } = useApiRequest();

    const { setRestoreState, spotifyLogin, spotifyLogout } = useActions(
        dispatch
    );

    const value: SpotifyIdentityContextInterface = {
        ...state,
        spotifyLogin,
        spotifyLogout,
        setRestoreState
    };

    const restoreSpotifyToken = useCallback(async () => {
        try {
            const { spotifyToken, spotifyRefreshToken, spotifyExpirationDate } =
                getLocalStorage(LocalStorageItemNames.Spotify) || {};

            if (
                spotifyToken &&
                spotifyRefreshToken &&
                new Date(spotifyExpirationDate) > new Date()
            ) {
                console.log('restoring spotify token...');
                actions.auth.spotifyLogin(dispatch, {
                    spotifyToken,
                    spotifyRefreshToken,
                    spotifyExpirationDate: new Date(spotifyExpirationDate)
                });
            }
        } catch (e) {
            setRestoreState(false);
        }
    }, [dispatch, setRestoreState]);

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

            actions.auth.spotifyLogin(dispatch, {
                spotifyToken: response.data.access_token,
                spotifyRefreshToken: state.spotifyRefreshToken,
                spotifyExpirationDate: expirationDate
            });
        } catch (e) {
            console.error(e);
        }
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
        <SpotifyIdentityContext.Provider value={value}>
            {children}
        </SpotifyIdentityContext.Provider>
    );
};
