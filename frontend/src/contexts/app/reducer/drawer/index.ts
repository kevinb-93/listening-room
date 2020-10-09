import { _ as Hide } from './hide';
import { AppReducerAction, AppReducerMap } from '../types';

const reducers: AppReducerMap = {
    [AppReducerAction.hideDrawer]: Hide.reducer,
};

const actions = {
    hide: Hide.action,
};

export const _ = {
    reducers,
    actions,
};
