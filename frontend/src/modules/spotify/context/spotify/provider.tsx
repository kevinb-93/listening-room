import React, { useCallback, useEffect } from 'react';
import { SpotifyContext } from './context';
import { SpotifyContextInterface, SpotifyContextState } from './types';
import { __useSpotifyReducer, actions } from './reducer';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyReducer();

    const setQueue = useCallback(
        (params) => actions.queue.setQueue(dispatch, params),
        [dispatch]
    );

    const playTrack = useCallback(
        (track) => actions.queue.playTrack(dispatch, track),
        [dispatch]
    );

    const setDevices = useCallback(
        (devices) => actions.devices.setDevices(dispatch, devices),
        [dispatch]
    );

    const setActiveDevice = useCallback(
        (id) => actions.devices.setActiveDevice(dispatch, id),
        [dispatch]
    );

    const value: SpotifyContextInterface = {
        ...state,
        setQueue,
        playTrack,
        setDevices,
        setActiveDevice,
    };

    useEffect(() => {
        const queue =
            JSON.parse(localStorage.getItem('ls_queue')) ??
            ([] as SpotifyContextState['queue']);

        const nowPlaying =
            JSON.parse(localStorage.getItem('ls_now_playing')) ??
            (null as SpotifyContextState['nowPlaying']);

        console.log(queue);

        actions.queue.setQueue(dispatch, {
            action: 'add',
            tracks: queue,
        });

        if (nowPlaying) {
            actions.queue.playTrack(dispatch, nowPlaying);
        }
    }, [dispatch]);

    return (
        <SpotifyContext.Provider value={value}>
            {children}
        </SpotifyContext.Provider>
    );
};
