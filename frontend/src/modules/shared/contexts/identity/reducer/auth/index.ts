import { _ as Login } from './login';
import { _ as Logout } from './logout';
import { _ as SpotifyLogin } from './spotify-login';
import { IdentityReducerAction, IdentityReducerMap } from '../types';

const reducers: IdentityReducerMap = {
    [IdentityReducerAction.login]: Login.reducer,
    [IdentityReducerAction.logout]: Logout.reducer,
    [IdentityReducerAction.spotifyLogin]: SpotifyLogin.reducer
};

const actions = {
    login: Login.action,
    logout: Logout.action,
    spotifyLogin: SpotifyLogin.action
};

export const _ = {
    reducers,
    actions
};
