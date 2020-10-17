export interface IdentityContextInterface extends IdentityContextState {
    actions: { setSpotifyIdentity: (identity: SpotifyIdentity) => void };
}

export interface SpotifyIdentity {
    access_token: string;
    refresh_token: string;
}

export interface IdentityContextState {
    loggedIn: boolean;
    spotify: SpotifyIdentity;
}
