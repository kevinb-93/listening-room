import { AppContextState } from '../types';

export enum AppReducerAction {
    hideDrawer,
}

export interface AppReducerActionPayload<T> {
    type: AppReducerAction;
    payload: T;
}

export interface AppReducer {
    (state: AppContextState, payload: unknown): AppContextState;
}

export interface AppReducerMap {
    [key: string]: AppReducer;
}
