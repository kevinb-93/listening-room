import React, { useCallback, useEffect } from 'react';
import { SpotifyContext } from './context';
import { SpotifyContextInterface, SpotifyContextState } from './types';
import { __useSpotifyReducer, actions } from './reducer';
import {
    getLocalStorage,
    LocalStorageItemNames
} from '../../../shared/utils/local-storage';
import useAppIdentity from '../../../shared/hooks/useAppIdentity';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyReducer();
    const { isLoggedIn } = useAppIdentity();

    const setQueue = useCallback(
        params => actions.queue.setQueue(dispatch, params),
        [dispatch]
    );

    const playTrack = useCallback(
        track => actions.queue.playTrack(dispatch, track),
        [dispatch]
    );

    const setDevices = useCallback(
        devices => actions.devices.setDevices(dispatch, devices),
        [dispatch]
    );

    const setActiveDevice = useCallback(
        id => actions.devices.setActiveDevice(dispatch, id),
        [dispatch]
    );

    const value: SpotifyContextInterface = {
        ...state,
        setQueue,
        playTrack,
        setDevices,
        setActiveDevice
    };

    useEffect(() => {
        if (isLoggedIn) {
            const queue =
                getLocalStorage(LocalStorageItemNames.Queue) ??
                ([] as SpotifyContextState['queue']);

            const nowPlaying =
                getLocalStorage(LocalStorageItemNames.NowPlaying) ??
                (null as SpotifyContextState['nowPlaying']);

            setQueue({
                action: 'add',
                tracks: queue
            });

            if (nowPlaying) {
                playTrack(nowPlaying);
            }
        }
    }, [dispatch, isLoggedIn, playTrack, setQueue]);

    return (
        <SpotifyContext.Provider value={value}>
            {children}
        </SpotifyContext.Provider>
    );
};
