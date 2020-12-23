import { validationResult } from 'express-validator';

import HttpError from '../models/http-error';
import User from '../models/user';
import Token from '../models/token';
import { NextFunction, Request, Response } from 'express';
import { createToken, TokenTypes, verifyToken } from '../utils/token';

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
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
        const tokenDoc = await Token.findOne({ token: refreshToken });

        if (!tokenDoc) {
            return next(new HttpError('Token expired', 401));
        }

        const { userId, name } = verifyToken(
            tokenDoc.token,
            TokenTypes.Refresh
        );

        const accessToken = createToken({
            userId,
            name,
            type: TokenTypes.Access
        });

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
