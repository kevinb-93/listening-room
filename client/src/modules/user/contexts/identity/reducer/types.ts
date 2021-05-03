import { Reducer } from 'react';
import { UserIdentityContextState } from '../types';
import { ReducerAction } from '../../../../../types/react';
interface LoginPayload {
    userToken: UserIdentityContextState['userToken'];
}
type RestoreStatePayload = UserIdentityContextState['isRestoring'];

export enum IdentityReducerActionType {
    userLogin,
    userLogout,
    restoreState
}

export type IdentityReducer = Reducer<
    UserIdentityContextState,
    IdentityReducerAction
>;
export type IdentityReducerAction =
    | ReducerAction<IdentityReducerActionType.userLogin, LoginPayload>
    | ReducerAction<IdentityReducerActionType.userLogout, null>
    | ReducerAction<
          IdentityReducerActionType.restoreState,
          RestoreStatePayload
      >;
