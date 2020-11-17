import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import { initIO } from './utils/socket';

import spotifyRoutes from './routes/spotify-routes';
import partiesRoutes from './routes/parties-routes';
import HttpError from './models/http-error';
import { port } from './utils/server';
import secret from './utils/secret';

const app = express();

const corsOptions: CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
    ],
};

app.use(bodyParser.json())
    .use(express.static(path.join(__dirname, 'public')))
    .use(cookieParser())
    .use(cors(corsOptions));

app.use('/api/spotify', spotifyRoutes);
app.use('/api/party', partiesRoutes);

app.use(() => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use(
    (error: HttpError, _req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return next(error);
        }
        res.status(error.code || 500);
        res.json({ message: error.message || 'An unknown error occurred!' });
    }
);

mongoose
    .connect(secret.mongoCluster, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        const server = app.listen(port, () => {
            console.log(`Listening on ${port}`);
        });
        const io = initIO(server);
        io.on('connection', (socket) => {
            console.log('Client connected');
        });
    })
    .catch((err) => {
        console.log(err);
    });
