import { _ as Set } from './set-queue';
import { _ as Play } from './play-track';
import { SpotifyReducerAction, SpotifyReducerMap } from '../types';

const reducers: SpotifyReducerMap = {
    [SpotifyReducerAction.setQueue]: Set.reducer,
    [SpotifyReducerAction.playTrack]: Play.reducer
};

const actions = {
    setQueue: Set.action,
    playTrack: Play.action
};

export const _ = {
    reducers,
    actions
};
