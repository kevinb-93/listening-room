import { SpotifyIdentityReducerAction } from './reducer/types';

export interface SpotifyIdentityContextInterface
    extends SpotifyIdentityContextState {
    loginSpotify: (
        token: SpotifyIdentityContextState['spotifyToken'],
        refreshToken: SpotifyIdentityContextState['spotifyRefreshToken'],
        expirationDate: Date
    ) => void;
    logoutSpotify: () => void;
    dispatch: React.Dispatch<SpotifyIdentityReducerAction>;
}

export interface SpotifyIdentityContextState {
    isRestoring: boolean;
    spotifyToken: string;
    spotifyRefreshToken: string;
    spotifyExpirationDate: Date | null;
}
