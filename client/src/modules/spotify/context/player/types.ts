import { SpotifyPlayerReducerAction } from './reducer/types';

export interface SpotifyPlayerContextActions {
    playTrack: (track: SpotifyApi.TrackObjectFull) => void;
    deleteTrackFromQueue: (track: SpotifyApi.TrackObjectFull['id']) => void;
    addTrackToQueue: (track: SpotifyApi.TrackObjectFull) => void;
}

export type SpotifyPlayerReducerDispatch = React.Dispatch<
    SpotifyPlayerReducerAction
>;

export type SpotifyPlayerContextInterface = SpotifyPlayerContextState & {
    dispatch: SpotifyPlayerReducerDispatch;
} & SpotifyPlayerContextActions;

export interface SpotifyPlayerContextState {
    playbackState: Spotify.PlaybackState;
    player: Spotify.SpotifyPlayer;
    playerInstance: Spotify.WebPlaybackInstance;
    playNext: boolean;
    nowPlaying: SpotifyApi.TrackObjectFull;
    queue: SpotifyApi.TrackObjectFull[];
}
