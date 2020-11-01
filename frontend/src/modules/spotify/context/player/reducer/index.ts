import React from 'react';
import { _ as Player } from './player';
import { SpotifyPlayerReducerActionPayload } from './types';
import { SpotifyPlayerContextState } from '../types';

// Combine the actions from the sub-modules
export const actions = {
    player: Player.actions,
};

// Combine the reducers from sub-modules
export const reducers = {
    ...Player.reducers,
};

const Reducer = (
    state: SpotifyPlayerContextState,
    action: SpotifyPlayerReducerActionPayload<unknown>
): SpotifyPlayerContextState => {
    // first see if there's a reducer for this action
    if (reducers[action.type] === undefined) {
        // return current state
        return state;
    }

    // use the reducer to process this action and return the new state
    return reducers[action.type](state, action.payload);
};

const initialState: SpotifyPlayerContextState = {
    playbackState: null,
    player: null,
    playerInstance: null,
};

/**
 * React Hook providing access to reducer
 */
export const __useSpotifyPlayerReducer = () =>
    React.useReducer<React.Reducer<SpotifyPlayerContextState, unknown>>(
        Reducer,
        {
            ...initialState,
        }
    );
