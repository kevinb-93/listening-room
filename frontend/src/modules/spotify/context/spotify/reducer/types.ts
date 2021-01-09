import { SpotifyContextState } from '../types';

export enum SpotifyReducerAction {
    setQueue,
    playTrack,
    setDevices,
    setActiveDevice,
    setPlayback,
    SetApi
}

export interface SpotifyReducerActionPayload<T> {
    type: SpotifyReducerAction;
    payload: T;
}

export interface SpotifyReducer {
    (state: SpotifyContextState, payload: unknown): SpotifyContextState;
}

export interface SpotifyReducerMap {
    [key: string]: SpotifyReducer;
}
