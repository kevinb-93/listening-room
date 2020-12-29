import React, { useCallback, useEffect } from 'react';
import { WebSocketContext } from './context';
import { WebSocketContextInterface } from './types';
import { __useWebSocketReducer } from './reducer';
import useActions from './useActions';
import useAppIdentity from '../../hooks/useAppIdentity';
import { useUserProfileContext } from '../../../user/contexts/profile';

type JoinCallback = (err: null | Error, response?: { room: string }) => void;

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useWebSocketReducer();
    const { isLoggedIn } = useAppIdentity();
    const { userProfile } = useUserProfileContext();

    const { setSocket } = useActions(state, dispatch);

    const value: WebSocketContextInterface = {
        ...state,
        setSocket
    };

    const connectToWebSocket = useCallback(() => {
        if (!isLoggedIn || state.socket) {
            return;
        }

        setSocket();
    }, [isLoggedIn, setSocket, state.socket]);

    const joinRoomResponse: JoinCallback = (err, res) => {
        if (err) return console.error(err);

        console.log(res);
    };

    const connectToRoom = useCallback(
        (room: string) => {
            if (!state.socket || !room) {
                return;
            }

            state.socket.emit('join', room, joinRoomResponse);
        },
        [state.socket]
    );

    useEffect(() => {
        const roomToConnect = userProfile?.partyId;
        connectToRoom(roomToConnect);
    }, [connectToRoom, userProfile?.partyId]);

    useEffect(() => {
        connectToWebSocket();
    }, [connectToWebSocket]);

    const initSocketEvents = useCallback(() => {
        if (!state.socket) {
            return;
        }

        state.socket.on('connect', () => {
            console.log('socket connected');
        });

        state.socket.on('disconnect', (reason: string) => {
            console.log(`socket disconnected: ${reason}`);
            if (reason === 'io server disconnect') {
                state.socket.connect();
            }
        });

        state.socket.on('connect_error', (e: unknown) => {
            console.error(e);
        });
    }, [state.socket]);

    const disconnectSocket = useCallback(() => {
        state.socket?.disconnect();
    }, [state.socket]);

    useEffect(() => {
        initSocketEvents();

        return disconnectSocket;
    }, [disconnectSocket, initSocketEvents, state.socket]);

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
