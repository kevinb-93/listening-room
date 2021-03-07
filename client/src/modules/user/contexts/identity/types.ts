import React from 'react';
import { IdentityReducerAction } from './reducer/types';

export interface UserIdentityContextActions extends UserIdentityContextState {
    userLogout: () => void;
    setRestoreState: (state: UserIdentityContextState['isRestoring']) => void;
}

export type UserIdentityContextInterface = UserIdentityContextState & {
    dispatch: React.Dispatch<IdentityReducerAction>;
} & UserIdentityContextActions;

export type UserIdentityContextState = {
    userToken: string;
    isRestoring: boolean;
};
