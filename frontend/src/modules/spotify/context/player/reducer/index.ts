import React from 'react';
import {
    SpotifyPlayerReducerAction,
    SpotifyPlayerReducerActionType
} from './types';
import { SpotifyPlayerContextState } from '../types';
import {
    setLocalStorage,
    LocalStorageItemNames
} from '../../../../shared/utils/local-storage';

const Reducer = (
    state: SpotifyPlayerContextState,
    action: SpotifyPlayerReducerAction
): SpotifyPlayerContextState => {
    switch (action.type) {
        case SpotifyPlayerReducerActionType.setPlayback:
            return {
                ...state,
                playbackState: action.payload
            };
        case SpotifyPlayerReducerActionType.SetPlaybackPosition:
            return {
                ...state,
                playbackState: {
                    ...state.playbackState,
                    position: action.payload.position
                }
            };
        case SpotifyPlayerReducerActionType.setPlayNext:
            return {
                ...state,
                playNext: action.payload
            };
        case SpotifyPlayerReducerActionType.setPlayerInstance:
            return {
                ...state,
                playerInstance: action.payload
            };
        case SpotifyPlayerReducerActionType.setPlayer:
            return {
                ...state,
                player: action.payload
            };
        case SpotifyPlayerReducerActionType.PlayTrack:
            return {
                ...state,
                nowPlaying: action.payload
            };
        case SpotifyPlayerReducerActionType.QueueAdd: {
            const queue: SpotifyPlayerContextState['queue'] = [
                ...state.queue,
                action.payload.track
            ];

            setLocalStorage(LocalStorageItemNames.Queue, queue);
            return {
                ...state,
                queue
            };
        }
        case SpotifyPlayerReducerActionType.QueueDelete: {
            let queue: SpotifyPlayerContextState['queue'] = state.queue ?? [];
            queue = queue.filter(t => t.id !== action.payload.trackId);

            setLocalStorage(LocalStorageItemNames.Queue, queue);

            return {
                ...state,
                queue
            };
        }
        case SpotifyPlayerReducerActionType.QueueSet: {
            const queueState = action.payload.queue ?? [];

            setLocalStorage(LocalStorageItemNames.Queue, queueState);

            return {
                ...state,
                queue: queueState
            };
        }
    }
};

const initialState: SpotifyPlayerContextState = {
    playbackState: null,
    player: null,
    playerInstance: null,
    playNext: false,
    nowPlaying: null,
    queue: []
};

/**
 * React Hook providing access to reducer
 */
export const __useSpotifyPlayerReducer = () =>
    React.useReducer(Reducer, {
        ...initialState
    });
