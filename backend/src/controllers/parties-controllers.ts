import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import Party from '../models/party';
import User, { UserType } from '../models/user';
import HttpError from '../models/http-error';

export const create = async (
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

        const { name } = req.body;
        const existingUser = await User.findOne({ name });

        if (existingUser) {
            return next(new HttpError('User already exists', 422));
        }

        await User.createCollection();
        await Party.createCollection();

        const session = await mongoose.startSession();
        session.startTransaction();
        const newUser = new User({ name, userType: UserType.Host });
        await newUser.save({ session });
        const newParty = new Party({
            creator: newUser.id,
            host: newUser.id
        });
        await newParty.save({ session });
        newUser.parties.push(newParty.id);
        await newUser.save({ session });
        await session.commitTransaction();

        const accessToken = await newUser.createAccessToken();
        const refreshToken = await newUser.createRefreshToken();

        res.status(201).json({
            userId: newUser.id,
            name: newUser.name,
            accessToken,
            refreshToken,
            partyId: newParty.id
        });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const join = async (req: Request, res: Response, next: NextFunction) => {
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

        const { name } = req.body;

        const existingUser = await User.findOne({ name });

        if (existingUser) {
            return next(new HttpError('User already exists', 422));
        }

        const partyId = req.params.pid;

        const party = await Party.findById(partyId);

        if (!party) {
            return next(
                new HttpError('Could not find a party for this id', 404)
            );
        }

        await User.createCollection();
        const session = await mongoose.startSession();
        session.startTransaction();
        const newUser = new User({ name, userType: UserType.Guest });
        newUser.parties.push(party.id);
        await newUser.save({ session });
        await session.commitTransaction();

        const accessToken = await newUser.createAccessToken();
        const refreshToken = await newUser.createRefreshToken();

        res.status(201).json({
            userId: newUser.id,
            name: newUser.name,
            accessToken,
            refreshToken,
            partyId: partyId
        });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};
