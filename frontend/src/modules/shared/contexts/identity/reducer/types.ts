import { UserIdentityContextState } from '../types';

export enum UserIdentityReducerAction {
    userLogin,
    userLogout,
    restoreState
}

export interface UserIdentityReducerActionPayload<T> {
    type: UserIdentityReducerAction;
    payload: T;
}

export interface UserIdentityReducer {
    (
        state: UserIdentityContextState,
        payload: unknown
    ): UserIdentityContextState;
}

export interface UserIdentityReducerMap {
    [key: string]: UserIdentityReducer;
}
