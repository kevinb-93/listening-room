import React from 'react';
import { WebSocketReducer, WebSocketReducerActionType } from './types';
import { WebSocketContextState } from '../types';

const Reducer: WebSocketReducer = (state, action) => {
    switch (action.type) {
        case WebSocketReducerActionType.setSocket: {
            return { ...state, socket: action.payload.socket };
        }
        default: {
            return { ...state };
        }
    }
};

const initialState: WebSocketContextState = {
    socket: undefined
};

export const __useWebSocketReducer = () =>
    React.useReducer(Reducer, {
        ...initialState
    });
