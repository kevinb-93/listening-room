export interface IdentityContextInterface extends IdentityContextState {
    actions: {
        login: (
            token: IdentityContextState['token'],
            tokenExpirationDate: IdentityContextState['tokenExpirationDate']
        ) => void;
        logout: () => void;
        spotifyLogin: (token: IdentityContextState['spotifyToken']) => void;
    };
}

export interface IdentityContextState {
    token: string;
    tokenExpirationDate: Date;
    spotifyToken: string;
}
