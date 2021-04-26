import React from 'react';
import {
    SpotifyIdentityReducerAction,
    SpotifyIdentityReducerActionType
} from './types';
import { SpotifyIdentityContextState } from '../types';

const Reducer = (
    state: SpotifyIdentityContextState,
    action: SpotifyIdentityReducerAction
): SpotifyIdentityContextState => {
    switch (action.type) {
        case SpotifyIdentityReducerActionType.spotifyLogin:
            return { ...state, ...action.payload };
        case SpotifyIdentityReducerActionType.spotifyLogout:
            return {
                ...state,
                spotifyToken: '',
                spotifyExpirationDate: null,
                spotifyRefreshToken: ''
            };
        case SpotifyIdentityReducerActionType.restoreState:
            return { ...state, isRestoring: action.payload };
        default:
            return state;
    }
};

const initialState: SpotifyIdentityContextState = {
    isRestoring: true,
    spotifyToken: '',
    spotifyRefreshToken: '',
    spotifyExpirationDate: null
};

export const __useSpotifyIdentityReducer = () =>
    React.useReducer(Reducer, {
        ...initialState
    });
