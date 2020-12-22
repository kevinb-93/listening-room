import { SpotifyIdentityContextState } from '../types';

export enum SpotifyIdentityReducerAction {
    spotifyLogin,
    spotifyLogout,
    restoreState
}

export interface SpotifyIdentityReducerActionPayload<T> {
    type: SpotifyIdentityReducerAction;
    payload: T;
}

export interface SpotifyIdentityReducer {
    (
        state: SpotifyIdentityContextState,
        payload: unknown
    ): SpotifyIdentityContextState;
}

export interface SpotifyIdentityReducerMap {
    [key: string]: SpotifyIdentityReducer;
}
