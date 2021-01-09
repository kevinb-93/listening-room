import React from 'react';
import { _ as Devices } from './devices';
// import { _ as Api } from './api';
import { SpotifyReducerActionPayload } from './types';
import { SpotifyContextState } from '../types';

// Combine the actions from the sub-modules
export const actions = {
    devices: Devices.actions
    // api: Api.actions
};

// Combine the reducers from sub-modules
export const reducers = {
    ...Devices.reducers
    // ...Api.reducers
};

const Reducer = (
    state: SpotifyContextState,
    action: SpotifyReducerActionPayload<unknown>
): SpotifyContextState => {
    // first see if there's a reducer for this action
    if (reducers[action.type] === undefined) {
        // return current state
        return state;
    }

    // use the reducer to process this action and return the new state
    return reducers[action.type](state, action.payload);
};

const initialState: SpotifyContextState = {
    devices: [],
    activeDeviceId: ''
    // api: null
};

/**
 * React Hook providing access to reducer
 */
export const __useSpotifyReducer = () =>
    React.useReducer<React.Reducer<SpotifyContextState, unknown>>(Reducer, {
        ...initialState
    });
