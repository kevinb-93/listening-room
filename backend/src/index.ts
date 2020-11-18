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
import { port } from './utils/server';
import secret from './utils/secret';
import { errorHandler } from './middleware/error';
import { notFound } from './middleware/not-found';
import { corsOptions } from './config/cors';
import { initIO } from './utils/socket';

const app = express();

app.use(bodyParser.json())
    .use(express.static(path.join(__dirname, 'public')))
    .use(cookieParser())
    .use(cors(corsOptions));

app.use('/api/spotify', spotifyRoutes);
app.use('/api/party', partiesRoutes);
app.use('/api/message', messagesRoutes);

app.use(notFound);
app.use(errorHandler);

mongoose
    .connect(secret.mongoCluster, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        const server = http.createServer(app);
        const io = initIO(server);

        io.on('connection', () => {
            console.log('Client connected');
        });

        server.listen(port, () => console.log(`Listening on ${port}`));
    })
    .catch((err) => {
        console.log(err);
    });
