import React, { useCallback, useEffect, useRef } from 'react';
import SpotifyPlayerContext from './index';
import {
    SpotifyPlayerContextInterface,
    SpotifyPlayerContextState
} from './types';
import { __useSpotifyPlayerReducer } from './reducer';
import { loadScript } from '../../../shared/utils/load-script';
import { UserType } from '../../../user/contexts/identity/types';
import { useSpotifyIdentityContext } from '../identity';
import useAppIdentity from '../../../shared/hooks/useAppIdentity';
import { useUserProfileContext } from '../../../user/contexts/profile';
import {
    getLocalStorage,
    LocalStorageItemNames
} from '../../../shared/utils/local-storage';
import { useSpotifyContext } from '../spotify';
import { SpotifyPlayerReducerActionType } from './reducer/types';
import { spotifyApi } from '../../config/spotify-web-api';

const SpotifyPlayerProvider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyPlayerReducer();
    const { isLoggedIn } = useAppIdentity();
    const { userProfile } = useUserProfileContext();
    const { spotifyToken } = useSpotifyIdentityContext();
    const { activeDeviceId, setActiveDevice } = useSpotifyContext();

    const { player, playerInstance, playbackState, queue, playNext } = state;

    const playbackTimer = useRef<number>();
    const elaspedTime = useRef<number>();
    const playbackListener = useRef<Spotify.PlaybackState>(null);

    useEffect(
        function getCurrentPlayerState() {
            if (!player) {
                return;
            }

            player.getCurrentState().then(playback => {
                dispatch({
                    type: SpotifyPlayerReducerActionType.setPlayback,
                    payload: playback
                });
            });
        },
        [dispatch, player]
    );

    useEffect(
        function initPlaybackDevice() {
            if (!playerInstance?.device_id) {
                return;
            }

            if (activeDeviceId !== playerInstance?.device_id) {
                spotifyApi
                    .transferMyPlayback([playerInstance?.device_id])
                    .then(() => {
                        setActiveDevice(playerInstance?.device_id);
                    })
                    .catch(e =>
                        console.error('Could not transfer playback', e)
                    );
            }
        },
        [activeDeviceId, playerInstance?.device_id, setActiveDevice]
    );

    useEffect(
        function setDocumentHeader() {
            const artist =
                playbackState?.track_window.current_track.artists[0].name;
            const song = playbackState?.track_window.current_track.name;
            if (artist && song) {
                document.title = `${artist} - ${song}`;
            }
        },
        [
            playbackState?.track_window.current_track.artists,
            playbackState?.track_window.current_track.name
        ]
    );

    const clearPlaybackTimer = () => {
        clearInterval(playbackTimer.current);
        playbackTimer.current = undefined;
    };

    useEffect(
        function syncPlaybackPosition() {
            elaspedTime.current = playbackState?.position ?? 0;

            if (
                playbackState?.paused ||
                elaspedTime.current > playbackState?.duration
            ) {
                clearPlaybackTimer();
            }
        },
        [
            playbackState?.duration,
            playbackState?.paused,
            playbackState?.position
        ]
    );

    const setPlaybackTimer = useCallback(
        (timeoutDuration: number) =>
            setInterval(() => {
                elaspedTime.current += timeoutDuration;
                dispatch({
                    type: SpotifyPlayerReducerActionType.SetPlaybackPosition,
                    payload: { position: elaspedTime.current }
                });
            }, timeoutDuration),
        [dispatch]
    );

    const updatePlayerProgress = useCallback(() => {
        if (playbackState?.paused === false && !playbackTimer.current) {
            playbackTimer.current = setPlaybackTimer(500);
        }
    }, [playbackState?.paused, setPlaybackTimer]);

    useEffect(() => {
        updatePlayerProgress();

        return () => clearPlaybackTimer();
    }, [updatePlayerProgress]);

    useEffect(
        function loadSpotifyPlayer() {
            if (isLoggedIn && userProfile?.userType === UserType.Host) {
                loadScript(
                    'https://sdk.scdn.co/spotify-player.js',
                    'spotify-player'
                );
            }
        },
        [isLoggedIn, userProfile?.userType]
    );

    const initPlayer = useCallback(() => {
        const queue =
            getLocalStorage(LocalStorageItemNames.Queue) ??
            ([] as SpotifyPlayerContextState['queue']);

        const nowPlaying =
            getLocalStorage(LocalStorageItemNames.NowPlaying) ??
            (null as SpotifyPlayerContextState['nowPlaying']);

        dispatch({
            type: SpotifyPlayerReducerActionType.QueueSet,
            payload: { queue }
        });

        if (nowPlaying) {
            spotifyApi
                .play({ uris: [nowPlaying.uri] })
                .then(() => {
                    dispatch({
                        type: SpotifyPlayerReducerActionType.PlayTrack,
                        payload: nowPlaying
                    });
                    dispatch({
                        type: SpotifyPlayerReducerActionType.QueueDelete,
                        payload: { trackId: nowPlaying.id }
                    });
                })
                .catch(e => console.error('Unable to play track', e));
        }
    }, [dispatch]);

    const hasPlaybackFinished = useCallback(
        (currentPlayback: Spotify.PlaybackState) => {
            try {
                if (!playbackListener.current || !currentPlayback) {
                    return false;
                }

                if (
                    playbackListener.current?.paused &&
                    playbackListener.current?.duration ===
                        currentPlayback?.duration &&
                    playbackListener.current?.position === 0 &&
                    playbackListener.current?.position ===
                        currentPlayback.position &&
                    playbackListener.current?.track_window?.current_track
                        ?.id ===
                        currentPlayback?.track_window?.current_track?.id
                ) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        []
    );

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
            player.addListener('player_state_changed', playback => {
                dispatch({
                    type: SpotifyPlayerReducerActionType.setPlayNext,
                    payload: hasPlaybackFinished(playback)
                });
                playbackListener.current = playback;
                dispatch({
                    type: SpotifyPlayerReducerActionType.setPlayback,
                    payload: playback
                });
            });

            // Ready
            player.addListener('ready', playerInstance => {
                console.log('Ready with Device ID', playerInstance.device_id);
                dispatch({
                    type: SpotifyPlayerReducerActionType.setPlayerInstance,
                    payload: playerInstance
                });
                initPlayer();
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            player.connect().then(success => {
                console.log('player connected: ' + success);
                if (success) {
                    dispatch({
                        type: SpotifyPlayerReducerActionType.setPlayer,
                        payload: player
                    });
                }
            });
        };
    }, [spotifyToken, initPlayer, hasPlaybackFinished, dispatch]);

    const playTrack = useCallback(
        (track: SpotifyApi.TrackObjectFull) => {
            spotifyApi
                .play({ uris: [track.uri] })
                .then(() => {
                    dispatch({
                        type: SpotifyPlayerReducerActionType.PlayTrack,
                        payload: track
                    });
                    dispatch({
                        type: SpotifyPlayerReducerActionType.QueueDelete,
                        payload: { trackId: track.id }
                    });
                })
                .catch(e => console.error('Unable to play track', e));
        },
        [dispatch]
    );

    useEffect(
        function triggerPlayNextTrack() {
            console.log('trigger play next callback check before');
            if (playNext) {
                console.log('trigger play next');
                dispatch({
                    type: SpotifyPlayerReducerActionType.setPlayNext,
                    payload: false
                });
                const track = queue[0];
                playTrack(track);
            }
        },
        [dispatch, playNext, playTrack, queue]
    );

    const value: SpotifyPlayerContextInterface = {
        ...state,
        dispatch,
        playTrack
    };

    return (
        <SpotifyPlayerContext.Provider value={value}>
            {children}
        </SpotifyPlayerContext.Provider>
    );
};

export default SpotifyPlayerProvider;
