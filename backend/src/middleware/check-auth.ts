import jwt from 'jsonwebtoken';
import { Request, NextFunction, Response } from 'express';

import HttpError from '../models/http-error';
import secret from '../config/secret';
import { TokenPayload } from '../typings/token';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    // Header = Authorization: Bearer 'Token'
    const token = req.get('Authorization')?.split(' ')[1];

    if (!token) {
        return next(new HttpError('Access denied, token missing!', 401));
    } else {
        try {
            const payload = jwt.verify(
                token,
                secret.ACCESS_TOKEN_KEY
            ) as TokenPayload;
            req.user = { userId: payload.userId };
            next();
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                return next(
                    new HttpError('Session timed out, please login again', 401)
                );
            } else if (e.name === 'JsonWebTokenError') {
                return next(
                    new HttpError('Invalid token, please login again', 401)
                );
            } else {
                console.error(e);
                return next(new HttpError('Authentication failed', 403));
            }
        }
    }
};
