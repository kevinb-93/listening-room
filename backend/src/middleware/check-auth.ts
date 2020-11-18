import jwt from 'jsonwebtoken';
import { Request, NextFunction, Response } from 'express';

import HttpError from '../models/http-error';
import secret from '../utils/secret';
import { TokenPayload } from '../typings/token';
// import { CheckAuthRequest } from '../typings/requests';

export const checkAuth = (req: Request, _res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        // Authorization: 'Bearer TOKEN'
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(
            token,
            secret.jwtPrivateKey
        ) as TokenPayload;
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed!', 403);
        return next(error);
    }
};
