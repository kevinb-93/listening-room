import { useCallback } from 'react';
import { actions } from './reducer';
import { baseUrl } from '../../config/api';
import { WebSocketContextActions, WebSocketContextState } from './types';
import { io } from 'socket.io-client';

const useActions = (
    state: WebSocketContextState,
    dispatch: React.Dispatch<unknown>
): WebSocketContextActions => {
    const setSocket = useCallback(() => {
        const socket = io(baseUrl);
        actions.socket.setSocket(dispatch, { socket });
    }, [dispatch]);

    return { setSocket };
};

export default useActions;
