import * as http from 'http';
import { Server } from 'socket.io';

let io: Server;

export const initIO = (httpServer: http.Server) => {
    io = new Server(httpServer);
    return io;
};

export const getIO = () => {
    if (!io) {
        return new Error('Socket.io not initialized!');
    }
    return io;
};

// module.exports = {
//     init: (httpServer: http.Server) => {
//         io = new Server(httpServer);
//         return io;
//     },
//     get: () => {
//         if (!io) {
//             return new Error('Socket.io not initialized!');
//         }
//         return io;
//     },
// };
