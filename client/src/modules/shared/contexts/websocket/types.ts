import { Socket } from 'socket.io-client';
import { WebSocketReducerAction } from './reducer/types';

export type WebSocketContextInterface = WebSocketContextState & {
    dispatch: React.Dispatch<WebSocketReducerAction>;
};

export interface WebSocketContextState {
    socket: Socket | undefined;
}
