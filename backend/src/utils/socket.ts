import * as http from 'http';
import * as socketio from 'socket.io';

let io: socketio.Server;

export const initIO = (httpServer: http.Server) => {
    io = new socketio.Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000'
        }
    });
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
