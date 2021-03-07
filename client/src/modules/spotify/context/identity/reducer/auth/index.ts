import { _ as SpotifyLogin } from './spotify-login';
import { _ as SpotifyLogout } from './spotify-logout';
import { _ as RestoreState } from './restore-state';
import {
    SpotifyIdentityReducerAction,
    SpotifyIdentityReducerMap
} from '../types';

const reducers: SpotifyIdentityReducerMap = {
    [SpotifyIdentityReducerAction.spotifyLogin]: SpotifyLogin.reducer,
    [SpotifyIdentityReducerAction.spotifyLogout]: SpotifyLogout.reducer,
    [SpotifyIdentityReducerAction.restoreState]: RestoreState.reducer
};

const actions = {
    spotifyLogin: SpotifyLogin.action,
    spotifyLogout: SpotifyLogout.action,
    restoreState: RestoreState.action
};

export const _ = {
    reducers,
    actions
};
