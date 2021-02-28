import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import HttpError from '../../shared/models/http-error.model';
import User, { UserRole } from './user.model';
import { NextFunction, Request, Response } from 'express';
import { createToken, TokenType, verifyToken } from '../../shared/utils/token';
import { isPasswordValid } from '../../shared/utils/password';

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

        const user = await User.findOne({ name });
        if (!user) {
            return next(new HttpError('No user found', 404));
        }

        const isValidPassword = await isPasswordValid(password, user.password);
        if (!isValidPassword) {
            return next(new HttpError('Invalid password', 401));
        }

        const accessToken = await user.createAccessToken();
        const refreshToken = await user.createRefreshToken();
        await user.save();

        res.status(201).json({ accessToken, refreshToken });
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

        let hashedPassword = '';
        if (!isAnonymous) {
            const user = await User.findOne({ name });
            if (user) {
                return next(new HttpError('User already exists', 400));
            }

            hashedPassword = await bcrypt.hash(password, 12);
        }

        const newUser = new User({
            name,
            password: isAnonymous ? password : hashedPassword,
            lastLoginAt: new Date(),
            isAnonymous,
            role: isAnonymous ? null : UserRole.User
        });
        const accessToken = await newUser.createAccessToken();
        await newUser.createRefreshToken();
        await newUser.save();

        res.status(201).json({ accessToken, user: newUser });
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

        const { refreshToken } = req.body;

        const userDoc = await User.findOne({
            refreshToken
        });

        if (!userDoc?.refreshToken) {
            return next(new HttpError('Token not found', 404));
        }

        const tokenPayload = verifyToken(
            userDoc.refreshToken,
            TokenType.Refresh
        );

        const accessToken = createToken({
            ...tokenPayload,
            type: TokenType.Access
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

        const user = await User.findById(req.user?.userId);

        if (!user) {
            return next(new HttpError('User not found', 404));
        }

        user.refreshToken = undefined;
        await user.save();

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
