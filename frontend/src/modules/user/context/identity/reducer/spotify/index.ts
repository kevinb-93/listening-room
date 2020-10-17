import { _ as Set } from './set';
import { IdentityReducerAction, IdentityReducerMap } from '../types';

const reducers: IdentityReducerMap = {
    [IdentityReducerAction.setSpotifyIdentity]: Set.reducer,
};

const actions = {
    set: Set.action,
};

export const _ = {
    reducers,
    actions,
};
