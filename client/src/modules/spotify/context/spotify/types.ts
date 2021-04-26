import { SpotifyReducerAction } from './reducer/types';

export interface SpotifyContextActions {
    dispatch: React.Dispatch<SpotifyReducerAction>;
}

export type SpotifyContextInterface = SpotifyContextState &
    SpotifyContextActions;

export interface SpotifyContextState {
    devices: SpotifyApi.UserDevice[];
    activeDeviceId: SpotifyApi.UserDevice['id'];
}

export interface SetSpotifyQueueParams {
    action: 'add' | 'delete';
    tracks: SpotifyApi.TrackObjectFull[];
}
