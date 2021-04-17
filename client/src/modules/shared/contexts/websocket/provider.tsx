import React, { useCallback, useEffect } from 'react';
import { WebSocketContext } from './context';
import { WebSocketContextInterface } from './types';
import { __useWebSocketReducer } from './reducer';
import useAppIdentity from '../../hooks/use-identity';
import { useUserProfileContext } from '../../../user/contexts/profile';
import { UserRole } from '../../../user/contexts/profile/types';
import { io } from 'socket.io-client';
import { baseUrl } from '../../config/api';
import { WebSocketReducerActionType } from './reducer/types';

type JoinCallback = (err: null | Error, response?: { room: string }) => void;

export enum RoomType {
    Host = 'host',
    Guest = 'guest',
    Party = 'party'
}

interface Room {
    id: string;
    type: RoomType;
}

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useWebSocketReducer();
    const { isLoggedIn } = useAppIdentity();
    const { user } = useUserProfileContext();

    const value: WebSocketContextInterface = {
        ...state
    };

    const connectPartyCallback: JoinCallback = useCallback(
        (err, res) => {
            if (err) return console.error(err);
            if (!state.socket) return;
            if (!user?.role || !user?._id) return;

            let roomType: RoomType;
            if (user?.role === UserRole.User) {
                roomType = RoomType.Guest;
            } else if (user?.role === UserRole.Admin) {
                roomType = RoomType.Host;
            }

            const room: Room = {
                id: user?._id,
                type: roomType
            };

            state.socket.emit('join', room);

            console.log(res);
        },
        [state.socket, user?._id, user?.role]
    );

    useEffect(
        function connectToParty() {
            if (!state.socket) return;

            const party = user?.party;
            if (!party) return;

            const room = { id: party, type: RoomType.Party };

            state.socket.emit('join', room, connectPartyCallback);
        },
        [connectPartyCallback, state.socket, user?.party]
    );

    const setSocket = useCallback(() => {
        const socket = io(baseUrl);
        dispatch({
            type: WebSocketReducerActionType.setSocket,
            payload: { socket }
        });
    }, [dispatch]);

    useEffect(
        function connectToWebSocket() {
            if (!isLoggedIn || state.socket) {
                return;
            }

            setSocket();
        },
        [isLoggedIn, setSocket, state.socket]
    );

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
                    state.socket.connect();
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
