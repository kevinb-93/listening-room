import { SpotifyContextState } from '../types';

export enum SpotifyReducerAction {
    setQueue,
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