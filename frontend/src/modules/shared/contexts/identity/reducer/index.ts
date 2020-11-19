import React from 'react';
import { _ as Auth } from './auth';
import { IdentityReducerActionPayload } from './types';
import { IdentityContextState } from '../types';

// Combine the actions from the sub-modules
export const actions = {
    auth: Auth.actions
};

// Combine the reducers from sub-modules
export const reducers = {
    ...Auth.reducers
};

const Reducer = (
    state: IdentityContextState,
    action: IdentityReducerActionPayload<unknown>
): IdentityContextState => {
    // first see if there's a reducer for this action
    if (reducers[action.type] === undefined) {
        // return current state
        return state;
    }

    // use the reducer to process this action and return the new state
    return reducers[action.type](state, action.payload);
};

const initialState: IdentityContextState = {
    token: null,
    tokenExpirationDate: null,
    spotifyToken: null,
    spotifyRefreshToken: null,
    spotifyExpirationDate: null
};

/**
 * React Hook providing access to reducer
 */
export const __useIdentityReducer = () =>
    React.useReducer<React.Reducer<IdentityContextState, unknown>>(Reducer, {
        ...initialState
    });
