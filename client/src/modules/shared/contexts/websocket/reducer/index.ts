import React from 'react';
import { _ as Socket } from './websocket';
import {
    WebSocketReducerActionPayload,
    WebSocketReducerPayload
} from './types';
import { WebSocketContextState } from '../types';

// Combine the actions from the sub-modules
export const actions = {
    socket: Socket.actions
};

// Combine the reducers from sub-modules
export const reducers = {
    ...Socket.reducers
};

const Reducer = (
    state: WebSocketContextState,
    action: WebSocketReducerActionPayload<WebSocketReducerPayload>
): WebSocketContextState => {
    if (reducers[action.type] === undefined) {
        return state;
    }

    return reducers[action.type](state, action.payload);
};

const initialState: WebSocketContextState = {
    socket: null
};

export const __useWebSocketReducer = () =>
    React.useReducer<React.Reducer<WebSocketContextState, unknown>>(Reducer, {
        ...initialState
    });
