import React from 'react';

import { SpotifyReducerAction, SpotifyReducerActionType } from './types';
import { SpotifyContextState } from '../types';

const Reducer = (
    state: SpotifyContextState,
    action: SpotifyReducerAction
): SpotifyContextState => {
    switch (action.type) {
        case SpotifyReducerActionType.setActiveDevice:
            return { ...state, activeDeviceId: action.payload };
        case SpotifyReducerActionType.setDevices:
            return { ...state, devices: action.payload };
        default:
            return state;
    }
};

const initialState: SpotifyContextState = {
    devices: [],
    activeDeviceId: ''
};

/**
 * React Hook providing access to reducer
 */
export const __useSpotifyReducer = () =>
    React.useReducer(Reducer, {
        ...initialState
    });
