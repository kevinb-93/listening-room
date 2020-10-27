import { _ as Set } from './set';
import { SpotifyReducerAction, SpotifyReducerMap } from '../types';

const reducers: SpotifyReducerMap = {
    [SpotifyReducerAction.setQueue]: Set.reducer,
};

const actions = {
    setQueue: Set.action,
};

export const _ = {
    reducers,
    actions,
};
