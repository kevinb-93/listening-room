import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import http from 'http';

import spotifyRoutes from './routes/spotify-routes';
import partiesRoutes from './routes/parties-routes';
import messagesRoutes from './routes/messages-routes';
import usersRoutes from './routes/users-routes';
import { port } from './utils/server';
import secret from './config/secret';
import { errorHandler } from './middleware/error';
import { notFound } from './middleware/not-found';
import { corsOptions } from './config/cors';
import { initIO } from './utils/socket';

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
app.use('/api/message', messagesRoutes);

// setup error middlewares
app.use(notFound);
app.use(errorHandler);

interface MessageData {
    messageId: string;
    message: string;
    partyId: string;
    senderId: string;
}

type JoinCallback = (err: null | Error, response?: { room: string }) => void;

// setup database connection
mongoose
    .connect(secret.MONGO_CLUSTER, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        const server = http.createServer(app);
        const io = initIO(server);

        io.on('connection', socket => {
            console.log('client connected');
            console.log(socket.rooms);

            socket.on('disconnect', () => {
                console.log('client disconnected');
            });

            socket.on('disconnecting', () => {
                console.log(socket.rooms);
                console.log('client disconnected');
            });

            socket.on('join', (room: string, callback: JoinCallback) => {
                socket.join(room);
                console.log(socket.rooms);
                callback(null, { room });
            });

            socket.on('add_message', async (data: MessageData) => {
                try {
                    socket.in(data.partyId).emit('add_message', data);
                } catch (e) {
                    console.error(e);
                    socket
                        .in(data.partyId)
                        .emit('message_error', 'Internal server error');
                }
            });

            socket.on('delete_message', async (data: MessageData) => {
                try {
                    socket
                        .in(data.partyId)
                        .emit('delete_message', { messageId: data.messageId });
                } catch (e) {
                    console.error(e);
                    socket
                        .in(data.partyId)
                        .emit('message_error', 'Internal server error');
                }
            });
        });

        server.listen(port, () => console.log(`Listening on ${port}`));
    })
    .catch(err => {
        console.log(err);
    });
