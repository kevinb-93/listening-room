export interface SpotifyIdentityContextInterface
    extends SpotifyIdentityContextState {
    spotifyLogin: (
        token: SpotifyIdentityContextState['spotifyToken'],
        refreshToken: SpotifyIdentityContextState['spotifyRefreshToken'],
        expirationDate: Date
    ) => void;
    spotifyLogout: () => void;
    setRestoreState: (
        state: SpotifyIdentityContextState['isRestoring']
    ) => void;
}

export interface SpotifyIdentityContextState {
    isRestoring: boolean;
    spotifyToken: string;
    spotifyRefreshToken: string;
    spotifyExpirationDate: Date;
}
