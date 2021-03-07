import { Socket } from 'socket.io-client';

export type WebSocketContextInterface = WebSocketContextActions &
    WebSocketContextState;

export interface WebSocketContextActions {
    setSocket: () => void;
}

export interface WebSocketContextState {
    socket: Socket;
}
