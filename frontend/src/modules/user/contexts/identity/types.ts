export interface UserIdentityContextInterface extends UserIdentityContextState {
    userLogin: (
        token: UserIdentityContextState['userToken'],
        refreshToken: UserIdentityContextState['userRefreshToken']
    ) => void;
    userLogout: () => void;
    setRestoreState: (state: UserIdentityContextState['isRestoring']) => void;
}

export enum UserType {
    Guest,
    Host
}

export interface User {
    userId: string;
    userType: UserType;
}

export interface UserIdentityContextState {
    userToken: string;
    userRefreshToken: string;
    isRestoring: boolean;
}
