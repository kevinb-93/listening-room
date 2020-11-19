import { IdentityContextState } from '../types';

export enum IdentityReducerAction {
    login,
    logout,
    spotifyLogin
}

export interface IdentityReducerActionPayload<T> {
    type: IdentityReducerAction;
    payload: T;
}

export interface IdentityReducer {
    (state: IdentityContextState, payload: unknown): IdentityContextState;
}

export interface IdentityReducerMap {
    [key: string]: IdentityReducer;
}
