import React from 'react';
import { _ as Auth } from './auth';
import { SpotifyIdentityReducerActionPayload } from './types';
import { SpotifyIdentityContextState } from '../types';

export const actions = {
    auth: Auth.actions
};

export const reducers = {
    ...Auth.reducers
};

const Reducer = (
    state: SpotifyIdentityContextState,
    action: SpotifyIdentityReducerActionPayload<unknown>
): SpotifyIdentityContextState => {
    if (reducers[action.type] === undefined) {
        return state;
    }

    return reducers[action.type](state, action.payload);
};

const initialState: SpotifyIdentityContextState = {
    isRestoring: true,
    spotifyToken: null,
    spotifyRefreshToken: null,
    spotifyExpirationDate: null
};

export const __useSpotifyIdentityReducer = () =>
    React.useReducer<React.Reducer<SpotifyIdentityContextState, unknown>>(
        Reducer,
        {
            ...initialState
        }
    );
