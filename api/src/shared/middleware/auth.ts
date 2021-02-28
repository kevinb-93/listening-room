import { Request, NextFunction, Response } from 'express';

import HttpError from '../models/http-error.model';
import { TokenType, verifyToken } from '../utils/token';

export const verifyAccessToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Header = Authorization: Bearer 'Token'
    const token = req.get('Authorization')?.split(' ')[1];

    if (!token) {
        return next(new HttpError('Access denied, token missing!', 401));
    } else {
        try {
            const { userId, role } = verifyToken(token, TokenType.Access);
            req.user = { userId, role };
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
