import React, { useCallback, useEffect } from 'react';
import { SpotifyContext } from './context';
import { SpotifyContextInterface } from './types';
import { __useSpotifyReducer, actions } from './reducer';
import { useSpotifyIdentityContext } from '../identity';
import { spotifyApi } from '../../config/spotify-web-api';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyReducer();
    const { spotifyToken } = useSpotifyIdentityContext();

    const setDevices = useCallback(
        devices => actions.devices.setDevices(dispatch, devices),
        [dispatch]
    );

    const setActiveDevice = useCallback(
        id => actions.devices.setActiveDevice(dispatch, id),
        [dispatch]
    );

    // const initSpotifyApi = useCallback(() => {
    //     if (spotifyToken) {
    //         const api = new SpotifyWebApi();
    //         api.setAccessToken(spotifyToken);
    //         actions.api.setApi(dispatch, { api });
    //     }
    // }, [dispatch, spotifyToken]);

    useEffect(
        function () {
            if (spotifyToken) {
                spotifyApi.setAccessToken(spotifyToken);
                // actions.api.setApi(dispatch, { api });
            }
        },
        [dispatch, spotifyToken]
    );

    const value: SpotifyContextInterface = {
        ...state,
        setDevices,
        setActiveDevice
    };

    return (
        <SpotifyContext.Provider value={value}>
            {children}
        </SpotifyContext.Provider>
    );
};
