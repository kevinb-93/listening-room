export interface SpotifyPlayerContextInterface
    extends SpotifyPlayerContextState {
    setPlayback: (playback: Spotify.PlaybackState) => void;
    setPlayer: (player: Spotify.SpotifyPlayer) => void;
    setPlayerInstance: (playerInstance: Spotify.WebPlaybackInstance) => void;
}

export interface SpotifyPlayerContextState {
    playbackState: Spotify.PlaybackState;
    player: Spotify.SpotifyPlayer;
    playerInstance: Spotify.WebPlaybackInstance;
}
