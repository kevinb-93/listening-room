import { _ as Set } from './set-socket';
import { WebSocketReducerAction, WebSocketReducerMap } from '../types';

const reducers: WebSocketReducerMap = {
    [WebSocketReducerAction.SetSocket]: Set.reducer
};

const actions = {
    setSocket: Set.action
};

export const _ = {
    reducers,
    actions
};
