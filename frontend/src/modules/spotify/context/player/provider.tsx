import React, { useCallback, useEffect } from 'react';
import { SpotifyPlayerContext } from './context';
import { SpotifyPlayerContextInterface } from './types';
import { __useSpotifyPlayerReducer, actions } from './reducer';
import { loadScript } from '../../../shared/utils/load-script';
import { UserType } from '../../../user/contexts/identity/types';
import { useSpotifyIdentityContext } from '../identity';
import useAppIdentity from '../../../shared/hooks/useAppIdentity';
import { useUserProfileContext } from '../../../user/contexts/profile';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyPlayerReducer();
    const { isLoggedIn } = useAppIdentity();
    const { userProfile } = useUserProfileContext();
    const { spotifyToken } = useSpotifyIdentityContext();

    const setPlayback: SpotifyPlayerContextInterface['setPlayback'] = useCallback(
        playback => actions.player.setPlayback(dispatch, playback),
        [dispatch]
    );

    const setPlayer: SpotifyPlayerContextInterface['setPlayer'] = useCallback(
        player => actions.player.setPlayer(dispatch, player),
        [dispatch]
    );

    const setPlayerInstance: SpotifyPlayerContextInterface['setPlayerInstance'] = useCallback(
        instance => actions.player.setPlayerInstance(dispatch, instance),
        [dispatch]
    );

    const setPlayNext: SpotifyPlayerContextInterface['setPlayNext'] = useCallback(
        playNext => actions.player.setPlayNext(dispatch, playNext),
        [dispatch]
    );

    useEffect(() => {
        if (isLoggedIn() && userProfile?.userType === UserType.Host) {
            loadScript(
                'https://sdk.scdn.co/spotify-player.js',
                'spotify-player'
            );
        }
    }, [isLoggedIn, userProfile?.userType]);

    useEffect(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                getOAuthToken: cb => {
                    cb(spotifyToken);
                }
            });

            // Error handling
            player.addListener('initialization_error', ({ message }) => {
                console.error('Failed to initialize', message);
            });
            player.addListener('authentication_error', ({ message }) => {
                console.error('Failed to authenticate', message);
            });
            player.addListener('account_error', ({ message }) => {
                console.error('Failed to validate Spotify account', message);
            });
            player.addListener('playback_error', ({ message }) => {
                console.error('Failed to perform playback', message);
            });

            // Playback status updates
            player.addListener('player_state_changed', playbackstate => {
                setPlayback(playbackstate);
            });

            // Ready
            player.addListener('ready', playerInstance => {
                console.log('Ready with Device ID', playerInstance.device_id);
                setPlayerInstance(playerInstance);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            player.connect().then(success => {
                console.log('player connected: ' + success);
                if (success) {
                    setPlayer(player);
                }
            });
        };
    }, [setPlayback, spotifyToken, setPlayer, setPlayerInstance]);

    const value: SpotifyPlayerContextInterface = {
        ...state,
        setPlayback,
        setPlayer,
        setPlayerInstance,
        setPlayNext
    };

    return (
        <SpotifyPlayerContext.Provider value={value}>
            {children}
        </SpotifyPlayerContext.Provider>
    );
};
