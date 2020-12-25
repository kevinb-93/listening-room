import { _ as Set } from './set';
import { UserProfileReducerAction, UserProfileReducerMap } from '../types';

const reducers: UserProfileReducerMap = {
    [UserProfileReducerAction.Set]: Set.reducer
};

const actions = {
    set: Set.action
};

export const _ = {
    reducers,
    actions
};
