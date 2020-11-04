import { SpotifyPlayerContextState } from '../types';

export enum SpotifyPlayerReducerAction {
    setPlayback,
    setPlayer,
    setPlayerInstance,
    setPlayNext,
}

export interface SpotifyPlayerReducerActionPayload<T> {
    type: SpotifyPlayerReducerAction;
    payload: T;
}

export interface SpotifyPlayerReducer {
    (
        state: SpotifyPlayerContextState,
        payload: unknown
    ): SpotifyPlayerContextState;
}

export interface SpotifyPlayerReducerMap {
    [key: string]: SpotifyPlayerReducer;
}
