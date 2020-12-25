import { UserProfileContextState } from '../types';
import { SetProfilePayload } from './profile/set';

export enum UserProfileReducerAction {
    Set
}

export interface UserProfileReducerActionPayload<T extends ActionPayload> {
    type: UserProfileReducerAction;
    payload: T;
}

export type ActionPayload = SetProfilePayload;

export interface UserProfileReducer {
    (
        state: UserProfileContextState,
        payload: ActionPayload
    ): UserProfileContextState;
}

export interface UserProfileReducerMap {
    [key: string]: UserProfileReducer;
}
