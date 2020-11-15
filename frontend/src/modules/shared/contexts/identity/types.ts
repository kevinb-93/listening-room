export interface IdentityContextInterface extends IdentityContextState {
    login: (
        token: IdentityContextState['token'],
        tokenExpirationDate: IdentityContextState['tokenExpirationDate']
    ) => void;
    logout: () => void;
    spotifyLogin: (
        token: IdentityContextState['spotifyToken'],
        refreshToken: IdentityContextState['spotifyRefreshToken'],
        expirationDate: Date
    ) => void;
    isLoggedIn: () => boolean;
}

export interface IdentityContextState {
    token: string;
    tokenExpirationDate: Date;
    spotifyToken: string;
    spotifyRefreshToken: string;
    spotifyExpirationDate: Date;
}
