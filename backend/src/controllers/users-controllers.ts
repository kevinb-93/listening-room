import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import HttpError from '../models/http-error';
import User from '../models/user';
import Token from '../models/token';
import { NextFunction, Request, Response } from 'express';
import secret from '../config/secret';
import { TokenPayload } from 'typings/token';

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // validate request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(
                new HttpError(
                    'Invalid inputs passed, please check your data.',
                    422
                )
            );
        }

        const { refreshToken } = req.body;

        // check if token is still valid
        const tokenDoc = await Token.findOne({ token: refreshToken });

        if (!tokenDoc) {
            return next(new HttpError('Token expired', 401));
        }

        // extract payload from refresh token
        const payload = jwt.verify(
            tokenDoc.token,
            secret.REFRESH_TOKEN_KEY
        ) as TokenPayload;

        // generate new access token
        const accessToken = jwt.sign(
            { userId: payload.userId, name: payload.name } as TokenPayload,
            secret.ACCESS_TOKEN_KEY,
            {
                expiresIn: '10m'
            }
        );

        res.status(200).json({ accessToken });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error!', 500));
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // validate request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(
                new HttpError(
                    'Invalid inputs passed, please check your data.',
                    422
                )
            );
        }

        // delete the refresh token saved in database
        const { refreshToken } = req.body;

        // check if token is still valid
        await Token.findOneAndDelete({ token: refreshToken });

        res.status(200).json({ success: 'User logged out!' });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error!', 500));
    }
};

export const currentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const userDoc = await User.findById(user?.userId);

        if (!userDoc) {
            return next(new HttpError('User not found', 401));
        }

        res.status(200).json({ user: userDoc.toObject() });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error!', 500));
    }
};
