export interface IdentityContextInterface extends IdentityContextState {
    login: (
        token: IdentityContextState['token'],
        refreshToken: IdentityContextState['refreshToken'],
        user: User
    ) => void;
    logout: () => void;
    spotifyLogin: (
        token: IdentityContextState['spotifyToken'],
        refreshToken: IdentityContextState['spotifyRefreshToken'],
        expirationDate: Date
    ) => void;
    isLoggedIn: () => boolean;
    setRestoreState: (state: IdentityContextState['isRestoring']) => void;
}

export enum UserType {
    Guest,
    Host
}

export interface User {
    userId: string;
    userType: UserType;
}

export interface IdentityContextState {
    token: string;
    refreshToken: string;
    user: User;
    isRestoring: boolean;
    spotifyToken: string;
    spotifyRefreshToken: string;
    spotifyExpirationDate: Date;
}
