import React, { useCallback, useEffect, useRef } from 'react';
import SpotifyPlayerContext from './index';
import {
    SpotifyPlayerContextInterface,
    SpotifyPlayerContextState
} from './types';
import { __useSpotifyPlayerReducer } from './reducer';
import { loadScript } from '../../../shared/utils/load-script';
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
import { useApiRequest } from '../../../shared/hooks/api-hook';
import {
    CurrentTrack,
    Track
} from '../../../../../../backend/src/models/party';
import { useAppContext } from '../../../../contexts/app';
import SpotifyWebApi from 'spotify-web-api-js';
import { UserRole } from '../../../user/contexts/profile/types';
// import { useWebSocketContext } from '../../../shared/contexts/websocket';

// enum RoomType {
//     Host,
//     Guest,
//     Party
// }

const SpotifyPlayerProvider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyPlayerReducer();
    const { isLoggedIn } = useAppIdentity();
    const { user } = useUserProfileContext();
    const { spotifyToken } = useSpotifyIdentityContext();
    const { activeDeviceId, setActiveDevice } = useSpotifyContext();

    const { sendRequest: sendGetPlayerRequest } = useApiRequest();
    const { sendRequest: sendNowPlayingRequest } = useApiRequest();
    const { sendRequest: sendAddQueueTrack } = useApiRequest();
    const { sendRequest: sendDeleteQueueTrack } = useApiRequest();
    // const { socket } = useWebSocketContext();

    const {
        player,
        playerInstance,
        playbackState,
        queue,
        playNext,
        nowPlaying
    } = state;

    const playbackTimer = useRef<number>();
    const elaspedTime = useRef<number>();
    const playbackListener = useRef<Spotify.PlaybackState>(null);
    const isPlaybackInitialized = useRef<boolean>(false);

    // const getHostPlayback = useCallback(() => {
    //     if (!socket) {
    //         return;
    //     }
    //     const room = user?.party;
    //     socket.emit('get_host_playback', room);
    // }, [socket, user?.party]);

    // useEffect(
    //     function initGuestPlayback() {
    //         if (user?.role === UserRole.Guest) {
    //             getHostPlayback();
    //         }
    //     },
    //     [getHostPlayback, user?.role]
    // );

    // useEffect(
    //     function initGuestPlaybackListener() {
    //         if (!socket) {
    //             return;
    //         }

    //         if (user?.role === UserRole.Guest) {
    //             socket.on(
    //                 'update_playback',
    //                 (playback: Spotify.PlaybackState) => {
    //                     dispatch({
    //                         type: SpotifyPlayerReducerActionType.setPlayback,
    //                         payload: playback
    //                     });
    //                 }
    //             );
    //         }
    //     },
    //     [dispatch, socket, user?.role]
    // );

    // useEffect(
    //     function initHostEvents() {
    //         if (!socket) {
    //             return;
    //         }

    //         if (user?.role === UserRole.Host) {
    //             socket.on('get_host_playback', (guestRoom: string) => {
    //                 const room = {
    //                     id: guestRoom,
    //                     type: RoomType.Guest
    //                 };
    //                 const data = { playbackState, room };
    //                 socket.emit('update_playback', data);
    //             });
    //         }
    //     },
    //     [playbackState, socket, user?.role]
    // );

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

    const deleteTrackFromQueue = useCallback(
        async (trackId: SpotifyApi.TrackObjectFull['id']) => {
            try {
                const res = await sendDeleteQueueTrack(
                    `party/queue/${user.party}`,
                    {
                        method: 'DELETE',
                        data: {
                            trackId
                        }
                    }
                );

                if (res.status === 204) {
                    dispatch({
                        type: SpotifyPlayerReducerActionType.QueueDelete,
                        payload: { trackId }
                    });
                }
            } catch (e) {
                console.error(e);
            }
        },
        [dispatch, sendDeleteQueueTrack, user?.party]
    );

    const playTrack = useCallback(
        (track: SpotifyApi.TrackObjectFull, position_ms = 1) => {
            spotifyApi
                .play({
                    uris: [track.uri],
                    device_id: playerInstance?.device_id,
                    position_ms
                })
                .then(data => {
                    if (!isPlaybackInitialized.current) {
                        isPlaybackInitialized.current = true;
                    }
                    console.log('track playing');
                    dispatch({
                        type: SpotifyPlayerReducerActionType.NowPlaying,
                        payload: track
                    });
                    deleteTrackFromQueue(track.id);
                    sendNowPlayingRequest(`party/now-playing/${user.party}`, {
                        method: 'PUT',
                        data: {
                            trackId: track.id,
                            durationMs: track.duration_ms,
                            elaspedMs: 1,
                            isPaused: false
                        }
                    });
                })
                .catch(e => console.error('Unable to play track', e));
        },
        [
            dispatch,
            user?.party,
            sendNowPlayingRequest,
            deleteTrackFromQueue,
            playerInstance?.device_id
        ]
    );

    const setInitialPlayback = useCallback(async () => {
        const res = await sendGetPlayerRequest(
            `party/${user.party}/player`,
            {}
        );

        const { queue, currentTrack } = res.data;

        const trackIds: string[] = [
            ...queue.map((q: Track) => q._id),
            currentTrack._id
        ].filter(t => t);

        try {
            if (!trackIds?.length) {
                return;
            }

            const { tracks } = await spotifyApi.getTracks(trackIds);

            if (!tracks) {
                return;
            }

            const queueTracks = tracks.filter(t => t.id !== currentTrack._id);

            if (queueTracks) {
                dispatch({
                    type: SpotifyPlayerReducerActionType.QueueSet,
                    payload: { queue: queueTracks }
                });
            }

            const nowPlaying = tracks.find(t => t.id === currentTrack._id);

            console.log('init player');

            if (nowPlaying) {
                playTrack(nowPlaying, currentTrack?.elaspedMs);
            } else if (queueTracks.length) {
                playTrack(queueTracks[0]);
            }
        } catch (e) {
            console.error(e);
        }
    }, [dispatch, playTrack, sendGetPlayerRequest, user?.party]);

    useEffect(
        function initPlayback() {
            if (playerInstance?.device_id && !isPlaybackInitialized?.current)
                setInitialPlayback();
        },
        [playerInstance?.device_id, setInitialPlayback]
    );

    // useEffect(
    //     function initPlaybackDevice() {
    //         if (!playerInstance?.device_id) {
    //             return;
    //         }

    //         if (activeDeviceId !== playerInstance?.device_id) {
    //             spotifyApi
    //                 .transferMyPlayback([playerInstance?.device_id], {
    //                     play: false
    //                 })
    //                 .then(() => {
    //                     setActiveDevice(playerInstance?.device_id);
    //                     initPlayback();
    //                 })
    //                 .catch(e =>
    //                     console.error('Could not transfer playback', e)
    //                 );
    //         }
    //     },
    //     [
    //         activeDeviceId,
    //         playerInstance?.device_id,
    //         setActiveDevice,
    //         initPlayback
    //     ]
    // );

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

    const savePlaybackProgress = useCallback(
        (playback: Spotify.PlaybackState) => {
            if (!playback?.track_window?.current_track) {
                return;
            }

            sendNowPlayingRequest(`party/now-playing/${user?.party}`, {
                method: 'PUT',
                data: {
                    trackId: playback.track_window.current_track.id,
                    durationMs: playback.duration,
                    elaspedMs: playback.position,
                    isPaused: playback?.paused
                }
            });
        },
        [sendNowPlayingRequest, user?.party]
    );

    useEffect(() => {
        updatePlayerProgress();

        return () => clearPlaybackTimer();
    }, [updatePlayerProgress]);

    useEffect(
        function loadSpotifyPlayer() {
            if (isLoggedIn && user?.role === UserRole.Admin) {
                loadScript(
                    'https://sdk.scdn.co/spotify-player.js',
                    'spotify-player'
                );
            }
        },
        [isLoggedIn, user?.role]
    );

    const addTrackToQueue = useCallback(
        async (track: SpotifyApi.TrackObjectFull) => {
            try {
                const res = await sendAddQueueTrack(
                    `party/queue/${user.party}`,
                    {
                        method: 'POST',
                        data: {
                            trackId: track.id
                        }
                    }
                );

                if (res.status === 201) {
                    dispatch({
                        type: SpotifyPlayerReducerActionType.QueueAdd,
                        payload: { track }
                    });
                }
            } catch (e) {
                console.error(e);
            }
        },
        [dispatch, sendAddQueueTrack, user?.party]
    );

    const hasPlaybackFinished = useCallback(
        (currentPlayback: Spotify.PlaybackState) => {
            try {
                if (!playbackListener.current || !currentPlayback) {
                    return false;
                }

                if (
                    playbackListener.current?.paused &&
                    currentPlayback?.paused &&
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

    useEffect(
        function initSpotifyPlayerSdk() {
            if (!spotifyToken) {
                return;
            }

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
                    console.error(
                        'Failed to validate Spotify account',
                        message
                    );
                });
                player.addListener('playback_error', ({ message }) => {
                    console.error('Failed to perform playback', message);
                });

                // Playback status updates
                player.addListener('player_state_changed', playback => {
                    if (!isPlaybackInitialized.current) {
                        return;
                    }
                    console.log(playback);
                    console.log(
                        'hasPlaybackfinsihed ' + hasPlaybackFinished(playback)
                    );
                    console.log(
                        'isPlaybackInit ' + isPlaybackInitialized.current
                    );

                    if (hasPlaybackFinished(playback)) {
                        dispatch({
                            type: SpotifyPlayerReducerActionType.setPlayNext,
                            payload: true
                        });
                    }

                    playbackListener.current = playback;
                    dispatch({
                        type: SpotifyPlayerReducerActionType.setPlayback,
                        payload: playback
                    });
                    savePlaybackProgress(playback);
                });

                // Ready
                player.addListener('ready', playerInstance => {
                    console.log(
                        'Ready with Device ID',
                        playerInstance.device_id
                    );
                    dispatch({
                        type: SpotifyPlayerReducerActionType.setPlayerInstance,
                        payload: playerInstance
                    });
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
        },
        [spotifyToken, hasPlaybackFinished, dispatch, savePlaybackProgress]
    );

    useEffect(
        function triggerPlayNextTrack() {
            if (playNext) {
                console.log('trigger play next');
                dispatch({
                    type: SpotifyPlayerReducerActionType.setPlayNext,
                    payload: false
                });

                if (queue.length) {
                    const track = queue[0];
                    playTrack(track);
                }
            }
        },
        [dispatch, playNext, playTrack, queue]
    );

    const value: SpotifyPlayerContextInterface = {
        ...state,
        dispatch,
        playTrack,
        addTrackToQueue,
        deleteTrackFromQueue
    };

    return (
        <SpotifyPlayerContext.Provider value={value}>
            {children}
        </SpotifyPlayerContext.Provider>
    );
};

export default SpotifyPlayerProvider;
