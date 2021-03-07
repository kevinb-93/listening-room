import { validationResult } from 'express-validator';

import HttpError from '../../shared/models/http-error.model';
import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { REFRESH_TOKEN_COOKIE_OPTIONS } from './token/token.refresh';

export const login = async (
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

        const { name, password } = req.body;
        try {
            const {
                accessToken,
                refreshToken
            } = await UserService.authenticate(name, password);
            res.cookie(
                'refreshToken',
                refreshToken,
                REFRESH_TOKEN_COOKIE_OPTIONS
            );
            res.status(201).json({ accessToken, refreshToken });
        } catch (e) {
            return next(e);
        }
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error!', 500));
    }
};

export const register = async (
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

        const { name, password, isAnonymous } = req.body;

        try {
            const response = await UserService.register({
                username: name,
                password,
                isAnonymous
            });
            res.cookie(
                'refreshToken',
                response.refreshToken,
                REFRESH_TOKEN_COOKIE_OPTIONS
            );
            res.status(201).json(response);
        } catch (error) {
            return next(error);
        }
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error!', 500));
    }
};

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
        const { refreshToken } = req.cookies;
        try {
            const response = await UserService.refreshTokens(
                refreshToken,
                'newt'
            );
            res.cookie(
                'refreshToken',
                response.refreshToken,
                REFRESH_TOKEN_COOKIE_OPTIONS
            );
            res.status(200).json(response);
        } catch (error) {
            res.cookie('refreshToken', null, {
                ...REFRESH_TOKEN_COOKIE_OPTIONS,
                expires: new Date()
            });
            return next(error);
        }
    } catch (e) {
        console.error(e);
        res.cookie('refreshToken', null, {
            ...REFRESH_TOKEN_COOKIE_OPTIONS,
            expires: new Date()
        });
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
        const userId = req.user?.userId;
        if (!userId) {
            return next(new HttpError('User not found', 404));
        }

        await UserService.logout(userId);
        res.status(200).json({ success: 'User logged out.' });
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
        if (!user?.userId) {
            return next(new HttpError('User not found', 422));
        }

        const { userDoc } = await UserService.getUser(user?.userId);

        res.status(200).json({ user: userDoc.toObject() });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error!', 500));
    }
};
