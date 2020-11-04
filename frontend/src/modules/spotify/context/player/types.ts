export interface SpotifyPlayerContextInterface
    extends SpotifyPlayerContextState {
    setPlayback: (playback: Spotify.PlaybackState) => void;
    setPlayer: (player: Spotify.SpotifyPlayer) => void;
    setPlayerInstance: (playerInstance: Spotify.WebPlaybackInstance) => void;
    setPlayNext: (playNext: boolean) => void;
}

export interface SpotifyPlayerContextState {
    playbackState: Spotify.PlaybackState;
    player: Spotify.SpotifyPlayer;
    playerInstance: Spotify.WebPlaybackInstance;
    playNext: boolean;
}
