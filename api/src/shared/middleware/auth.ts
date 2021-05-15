import { Request, NextFunction, Response } from 'express';
import HttpTokenError from '../models/http-token-error.model';

import { TokenType, verifyToken } from '../utils/token';

export const verifyAccessToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Header = Authorization: Bearer 'Token'
    const token = req.get('Authorization')?.split(' ')[1];

    if (!token) {
        return next(new HttpTokenError('Access denied, token missing!', 401));
    } else {
        try {
            const { userId, role } = verifyToken(token, TokenType.Access);
            req.user = { userId, role };
            next();
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                return next(
                    new HttpTokenError(
                        'Session timed out, please login again',
                        401
                    )
                );
            } else if (e.name === 'JsonWebTokenError') {
                return next(
                    new HttpTokenError('Invalid token, please login again', 401)
                );
            } else {
                console.error(e);
                return next(new HttpTokenError('Authentication failed', 403));
            }
        }
    }
};
