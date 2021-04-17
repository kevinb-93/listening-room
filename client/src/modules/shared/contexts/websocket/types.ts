import { Socket } from 'socket.io-client';

export type WebSocketContextInterface = WebSocketContextState;

export interface WebSocketContextState {
    socket: Socket;
}
