import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import http from 'http';

import spotifyRoutes from './modules/spotify/spotify.routes';
import partiesRoutes from './modules/party/party.routes';
import chatRoutes from './modules/chat/chat.routes';
import usersRoutes from './modules/user/user.routes';
import { port } from './shared/utils/server';
import secret from './shared/config/secret';
import { errorHandler } from './shared/middleware/error';
import { notFound } from './shared/middleware/not-found';
import { corsOptions } from './shared/config/cors';
import { initIO } from './shared/utils/socket';

// initialize express app
const app = express();
app.use(bodyParser.json())
    .use(express.static(path.join(__dirname, 'public')))
    .use(cookieParser())
    .use(cors(corsOptions));

// setup routes
app.use('/api/user', usersRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/party', partiesRoutes);
app.use('/api/chat', chatRoutes);

// setup error middlewares
app.use(notFound);
app.use(errorHandler);

interface SocketPayload {
    data: unknown;
    roomId: string;
}

// setup database connection
mongoose
    .connect(secret.MONGO_CLUSTER, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        const server = http.createServer(app);
        const io = initIO(server);

        io.on('connection', socket => {
            console.log('client connected');

            socket.on('disconnect', () => {
                console.log('client disconnected');
            });

            socket.on('disconnecting', () => {
                console.log('client disconnecting');
            });

            socket.on('join', (roomId: string) => {
                socket.join(roomId);
                console.log(socket.rooms);
            });

            socket.on(
                'add_message',
                async ({ data, roomId }: SocketPayload) => {
                    try {
                        socket.in(roomId).emit('add_message', data);
                    } catch (e) {
                        console.error(e);
                        socket
                            .in(roomId)
                            .emit('message_error', 'Internal server error');
                    }
                }
            );

            socket.on(
                'delete_message',
                async ({ data, roomId }: SocketPayload) => {
                    try {
                        socket.in(roomId).emit('delete_message', data);
                    } catch (e) {
                        console.error(e);
                        socket
                            .in(roomId)
                            .emit('message_error', 'Internal server error');
                    }
                }
            );
        });

        server.listen(port, () => console.log(`Listening on ${port}`));
    })
    .catch(err => {
        console.log(err);
    });
