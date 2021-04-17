import { Reducer } from 'react';
import { WebSocketContextState } from '../types';
import { ReducerAction } from '../../../../../types/react';

export enum WebSocketReducerActionType {
    setSocket
}
export interface SetSocketPayload {
    socket: WebSocketContextState['socket'];
}

export type WebSocketReducer = Reducer<
    WebSocketContextState,
    WebSocketReducerAction
>;

export type WebSocketReducerAction = ReducerAction<
    WebSocketReducerActionType.setSocket,
    SetSocketPayload
>;
