import { _ as SetPlayback } from './set-playback';
import { _ as SetPlayer } from './set-player';
import { _ as SetPlayerInstance } from './set-player-instance';
import { SpotifyPlayerReducerAction, SpotifyPlayerReducerMap } from '../types';

const reducers: SpotifyPlayerReducerMap = {
    [SpotifyPlayerReducerAction.setPlayback]: SetPlayback.reducer,
    [SpotifyPlayerReducerAction.setPlayer]: SetPlayer.reducer,
    [SpotifyPlayerReducerAction.setPlayerInstance]: SetPlayerInstance.reducer,
};

const actions = {
    setPlayback: SetPlayback.action,
    setPlayer: SetPlayer.action,
    setPlayerInstance: SetPlayerInstance.action,
};

export const _ = {
    reducers,
    actions,
};
