import { UserProfileContextState } from '../types';

export interface UserProfileReducerMap {
    [key: string]: UserProfileReducer;
}

interface ReducerAction<
    T extends UserProfileReducerActionType,
    P extends UserProfileContextState[keyof UserProfileContextState]
> {
    type: T;
    payload: P;
}

export enum UserProfileReducerActionType {
    SetProfile
}

export type UserProfileReducerAction = ReducerAction<
    UserProfileReducerActionType.SetProfile,
    UserProfileContextState['user']
>;

export interface UserProfileReducer {
    (
        state: UserProfileContextState,
        payload: UserProfileReducerAction
    ): UserProfileContextState;
}
