import { _ as SetPlayback } from './set-playback';
import { _ as SetPlayer } from './set-player';
import { _ as SetPlayerInstance } from './set-player-instance';
import { _ as SetPlayNext } from './set-play-next';
import { SpotifyPlayerReducerAction, SpotifyPlayerReducerMap } from '../types';

const reducers: SpotifyPlayerReducerMap = {
    [SpotifyPlayerReducerAction.setPlayback]: SetPlayback.reducer,
    [SpotifyPlayerReducerAction.setPlayer]: SetPlayer.reducer,
    [SpotifyPlayerReducerAction.setPlayerInstance]: SetPlayerInstance.reducer,
    [SpotifyPlayerReducerAction.setPlayNext]: SetPlayNext.reducer
};

const actions = {
    setPlayback: SetPlayback.action,
    setPlayer: SetPlayer.action,
    setPlayerInstance: SetPlayerInstance.action,
    setPlayNext: SetPlayNext.action
};

export const _ = {
    reducers,
    actions
};
