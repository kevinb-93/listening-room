import { WebSocketContextState } from '../types';
import { SetSocketPayload } from './websocket/set-socket';

export enum WebSocketReducerAction {
    SetSocket
}

export interface WebSocketReducerActionPayload<T> {
    type: WebSocketReducerAction;
    payload: T;
}

export type WebSocketReducerPayload = SetSocketPayload;

export interface WebSocketReducer {
    (
        state: WebSocketContextState,
        payload: WebSocketReducerPayload
    ): WebSocketContextState;
}

export interface WebSocketReducerMap {
    [key: string]: WebSocketReducer;
}
