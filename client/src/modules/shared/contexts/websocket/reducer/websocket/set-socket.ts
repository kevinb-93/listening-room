import {
    WebSocketReducerActionPayload,
    WebSocketReducerAction
} from '../types';
import { WebSocketContextState } from '../../types';

export interface SetSocketPayload {
    socket: WebSocketContextState['socket'];
}

const action = (
    dispatch: React.Dispatch<WebSocketReducerActionPayload<SetSocketPayload>>,
    payload: SetSocketPayload
) => {
    dispatch({
        type: WebSocketReducerAction.SetSocket,
        payload
    });
};

const reducer = (
    state: WebSocketContextState,
    { socket }: SetSocketPayload
): WebSocketContextState => {
    return {
        ...state,
        socket
    };
};

export const _ = {
    action,
    reducer
};
