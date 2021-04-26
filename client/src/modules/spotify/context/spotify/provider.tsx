import React, { useEffect } from 'react';
import { SpotifyContext } from './context';
import { SpotifyContextInterface } from './types';
import { __useSpotifyReducer } from './reducer';
import { useSpotifyIdentityContext } from '../identity';
import { spotifyApi } from '../../config/spotify-web-api';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyReducer();
    const { spotifyToken } = useSpotifyIdentityContext();

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
        dispatch
    };

    return (
        <SpotifyContext.Provider value={value}>
            {children}
        </SpotifyContext.Provider>
    );
};
