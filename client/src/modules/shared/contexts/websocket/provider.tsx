import React, { useCallback, useEffect } from 'react';
import { WebSocketContext } from './context';
import { WebSocketContextInterface } from './types';
import { __useWebSocketReducer } from './reducer';

export enum RoomType {
    Host = 'host',
    Guest = 'guest',
    Party = 'party'
}

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useWebSocketReducer();

    const value: WebSocketContextInterface = {
        ...state,
        dispatch
    };

    const disconnectSocket = useCallback(() => {
        state.socket?.disconnect();
    }, [state.socket]);

    useEffect(
        function initSocketEvents() {
            if (!state.socket) {
                return;
            }

            state.socket.on('connect', () => {
                console.log('socket connected');
            });

            state.socket.on('disconnect', (reason: string) => {
                console.log(`socket disconnected: ${reason}`);
                if (reason === 'io server disconnect') {
                    state?.socket?.connect();
                }
            });

            state.socket.on('connect_error', (e: unknown) => {
                console.error(e);
            });

            return disconnectSocket;
        },
        [disconnectSocket, state.socket]
    );

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
