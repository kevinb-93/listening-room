import { _ as Set } from './set-devices';
import { _ as SetActive } from './set-active-device';
import { SpotifyReducerAction, SpotifyReducerMap } from '../types';

const reducers: SpotifyReducerMap = {
    [SpotifyReducerAction.setDevices]: Set.reducer,
    [SpotifyReducerAction.setActiveDevice]: SetActive.reducer,
};

const actions = {
    setDevices: Set.action,
    setActiveDevice: SetActive.action,
};

export const _ = {
    reducers,
    actions,
};
