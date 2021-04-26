import { UserProfileReducerAction } from './reducer/types';

export type UserProfileReducerDispatch = React.Dispatch<UserProfileReducerAction>;

export type UserProfileContextInterface = UserProfileContextState & {
    dispatch: UserProfileReducerDispatch;
};

export enum UserRole {
    User = 'user',
    Admin = 'admin'
}

export interface User {
    _id: string;
    lastLoginAt: string;
    party: string;
    name: string;
    role: UserRole;
}

export interface UserProfileContextState {
    user: User;
}
