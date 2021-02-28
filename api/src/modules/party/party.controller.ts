import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import Party, { Track } from './party.model';
import Message from '../chat/chat.model';
import User, { UserRole } from '../user/user.model';
import HttpError from '../../shared/models/http-error.model';
import { hasUserAccess, Permission } from '../../shared/utils/user-access';

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

        const requestUser = req.user;
        if (
            !requestUser?.role ||
            !hasUserAccess(Permission.CreateParty, requestUser.role)
        ) {
            return next(new HttpError('Access denied', 403));
        }

        const user = await User.findOne({ _id: requestUser?.userId });
        if (!user) {
            return next(new HttpError('User not found', 404));
        }

        const party = await Party.findOne({ host: user._id });
        if (party) {
            return next(new HttpError('You are already hosting a party', 422));
        }

        await Party.createCollection();
        const session = await mongoose.startSession();
        session.startTransaction();
        const newParty = new Party({
            creator: user._id,
            host: user._id
        });
        await newParty.save({ session });
        user.party = newParty.id;
        user.role = UserRole.Admin;
        await user.save({ session });
        await session.commitTransaction();

        res.status(201).json({
            userId: user._id,
            name: user.name,
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

        const reqUser = req.user;

        if (!reqUser) {
            return next(new HttpError('Unauthorised', 401));
        }

        const { partyId, userId } = req.body;

        if (reqUser.userId !== userId) {
            return next(new HttpError('Unauthorised', 401));
        }

        const party = await Party.findById(partyId);

        if (!party) {
            return next(new HttpError('Party not found.', 404));
        }

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return next(new HttpError('User not found', 404));
        }

        if (user.party?.toString() === partyId) {
            return next(new HttpError('Already a party member', 422));
        }

        user.party = partyId;
        await user.save();

        res.status(201).json({
            partyId: party.id
        });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const party = async (
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

        const partyId = req.params.pid;

        const party = await Party.findById(partyId);

        if (!party) {
            return next(
                new HttpError('Could not find a party for this id', 404)
            );
        }

        res.status(201).json({
            party: party.toObject()
        });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const messages = async (
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

        const partyId = req.params.pid;

        const messages = await Message.find({ partyId: partyId }).exec();

        res.status(200).json({
            messages: messages
        });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const nowPlaying = async (
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

        const partyId = req.params.pid;
        const { trackId, durationMs, elaspedMs, isPaused } = req.body;

        const party = await Party.findById(partyId);

        if (!party) {
            return next(new HttpError('Party not found', 401));
        }

        party.currentTrack._id = trackId;
        party.currentTrack.durationMs = durationMs;
        party.currentTrack.elaspedMs = elaspedMs;
        party.currentTrack.isPaused = isPaused;

        await party.save();

        res.status(204).json();
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const updateQueue = async (
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

        const partyId = req.params.pid;
        const { tracks } = req.body;

        let queue: Track[] = [];

        queue = tracks.map((track: never) => {
            return { _id: track };
        });

        const party = await Party.findById(partyId);

        if (!party) {
            return next(new HttpError('Party not found', 401));
        }

        party.queue = queue;

        await party.save();

        res.status(200).json({ queue: party.queue });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const addTrackQueue = async (
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

        const partyId = req.params.pid;
        const { trackId } = req.body;

        const party = await Party.findById(partyId);

        let trackExists = Boolean(party?.currentTrack?._id === trackId);
        if (trackExists) {
            return next(new HttpError('Track already playing.', 409));
        }

        trackExists = Boolean(party?.queue?.some(q => q._id === trackId));
        if (trackExists) {
            return next(new HttpError('Track already added to queue.', 409));
        }

        if (!party) {
            return next(new HttpError('Party not found', 401));
        }

        party.queue.push({ _id: trackId });

        await party.save();

        res.status(201).json({ queue: party.queue });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const deleteTrackQueue = async (
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

        const partyId = req.params.pid;
        const { trackId } = req.body;

        const party = await Party.findById(partyId);

        if (!party) {
            return next(new HttpError('Party not found', 401));
        }

        party.queue = party.queue.filter(t => t._id !== trackId);

        await party.save();

        res.status(204).json();
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const getQueue = async (
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

        const partyId = req.params.pid;

        const party = await Party.findById(partyId);

        if (!party) {
            return next(new HttpError('Party not found', 401));
        }

        res.status(200).json({ queue: party.queue });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const getPlayer = async (
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

        const partyId = req.params.pid;

        const party = await Party.findById(partyId);

        if (!party) {
            return next(new HttpError('Party not found', 401));
        }

        res.status(200).json({
            currentTrack: party.currentTrack,
            queue: party.queue
        });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const getParties = async (
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

        const parties = await Party.find();

        if (!parties) {
            return next(new HttpError('No party not found', 401));
        }

        res.status(200).json(parties);
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};
