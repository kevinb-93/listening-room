export interface SpotifyContextActions {
    setDevices: (device: SpotifyContextState['devices']) => void;
    setActiveDevice: (id: SpotifyApi.UserDevice['id']) => void;
}

export type SpotifyContextInterface = SpotifyContextState &
    SpotifyContextActions;

export interface SpotifyContextState {
    devices: SpotifyApi.UserDevice[];
    activeDeviceId: SpotifyApi.UserDevice['id'];
    // api: SpotifyWebApi.SpotifyWebApiJs;
}

export interface SetSpotifyQueueParams {
    action: 'add' | 'delete';
    tracks: SpotifyApi.TrackObjectFull[];
}
