export interface SpotifyContextInterface extends SpotifyContextState {
    actions: {
        setQueue: (params: SetSpotifyQueueParams) => void;
    };
}

export interface SpotifyContextState {
    queue: SpotifyApi.TrackObjectFull[];
}

export interface SetSpotifyQueueParams {
    action: 'add' | 'delete';
    tracks: SpotifyApi.TrackObjectFull[];
}
