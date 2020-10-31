export interface SpotifyContextInterface extends SpotifyContextState {
    setQueue: (params: SetSpotifyQueueParams) => void;
    playTrack: (track: SpotifyContextState['nowPlaying']) => void;
    setDevices: (device: SpotifyContextState['devices']) => void;
    setActiveDevice: (id: SpotifyApi.UserDevice['id']) => void;
}

export interface SpotifyContextState {
    nowPlaying: SpotifyApi.TrackObjectFull;
    queue: SpotifyApi.TrackObjectFull[];
    devices: SpotifyApi.UserDevice[];
    activeDeviceId: SpotifyApi.UserDevice['id'];
}

export interface SetSpotifyQueueParams {
    action: 'add' | 'delete';
    tracks: SpotifyApi.TrackObjectFull[];
}
