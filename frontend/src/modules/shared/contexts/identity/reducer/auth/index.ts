import { _ as Login } from './login';
import { _ as Logout } from './logout';
import { _ as RestoreState } from './restore-state';
import { UserIdentityReducerAction, UserIdentityReducerMap } from '../types';

const reducers: UserIdentityReducerMap = {
    [UserIdentityReducerAction.userLogin]: Login.reducer,
    [UserIdentityReducerAction.userLogout]: Logout.reducer,
    [UserIdentityReducerAction.restoreState]: RestoreState.reducer
};

const actions = {
    login: Login.action,
    logout: Logout.action,
    restoreState: RestoreState.action
};

export const _ = {
    reducers,
    actions
};
