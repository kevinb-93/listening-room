import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Party from '../models/party';
import User from '../models/user';
import HttpError from '../models/http-error';
import secret from '../utils/secret';
import { TokenPayload } from '../typings/token';

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ name });
    } catch (e) {
        return next(
            new HttpError('Creating party failed, please try again later.', 500)
        );
    }

    if (existingUser) {
        return next(new HttpError('User already exists', 422));
    }

    const newUser = new User({ name });

    // save new user
    try {
        await User.createCollection();
        await Party.createCollection();

        const session = await mongoose.startSession();
        session.startTransaction();
        await newUser.save({ session });
        const newParty = new Party({
            creator: newUser.id,
            host: newUser.id,
        });
        await newParty.save({ session });
        newUser.parties.push(newParty.id);
        await newUser.save({ session });
        await session.commitTransaction();
    } catch (e) {
        return next(
            new HttpError('Creating party failed, please try again later.', 500)
        );
    }

    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id, name: newUser.name } as TokenPayload,
            secret.jwtPrivateKey,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Creating party failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({ userId: newUser.id, name: newUser.name, token });
};

export const join = async (req: Request, res: Response, next: NextFunction) => {
    // validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ name });
    } catch (e) {
        return next(
            new HttpError('Joining party failed, please try again later.', 500)
        );
    }

    if (existingUser) {
        return next(new HttpError('User already exists', 422));
    }

    const partyId = req.params.pid;

    // find party
    let party;
    try {
        party = await Party.findById(partyId);
    } catch (err) {
        return next(
            new HttpError('Something went wrong, could not join party', 500)
        );
    }

    if (!party) {
        return next(new HttpError('Could not find a party for this id', 404));
    }

    const newUser = new User({ name });

    // save new user
    try {
        await User.createCollection();

        const session = await mongoose.startSession();
        session.startTransaction();
        newUser.parties.push(party.id);
        await newUser.save({ session });
        await session.commitTransaction();
    } catch (e) {
        return next(
            new HttpError('Joining party failed, please try again later.', 500)
        );
    }

    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id, name: newUser.name } as TokenPayload,
            secret.jwtPrivateKey,
            { expiresIn: '1h' }
        );
    } catch (err) {
        return next(
            new HttpError('Joining party failed, please try again later.', 500)
        );
    }

    res.status(201).json({ userId: newUser.id, name: newUser.name, token });
};
