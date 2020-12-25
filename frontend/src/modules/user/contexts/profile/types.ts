export type UserProfileContextInterface = UserProfileContextState &
    UserProfileContextActions;

export interface UserProfileContextActions {
    set: (profile: UserProfile) => void;
}

export enum UserType {
    Guest,
    Host
}

export interface UserProfile {
    userId: string;
    userType: UserType;
    partyId: string;
}

export interface UserProfileContextState {
    userProfile: UserProfile;
}
