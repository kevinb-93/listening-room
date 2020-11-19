import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
// // import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

import Message from '../models/message';
import Party from '../models/party';
import HttpError from '../models/http-error';
// import secret from '../utils/secret';

export const createMessage = async (
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

    const { message, partyId } = req.body;
    const senderId = req.userData?.userId;

    let party;
    try {
        party = await Party.findById(partyId);
    } catch (e) {
        return next(
            new HttpError(
                'Something went wrong finding party, please try again later.',
                500
            )
        );
    }

    if (!party) {
        return next(new HttpError("Party doesn't exist", 422));
    }

    const newMessage = new Message({ senderId, message, partyId: party.id });

    // save new message
    try {
        await newMessage.save();
    } catch (e) {
        return next(
            new HttpError(
                'Creating message failed, please try again later.',
                500
            )
        );
    }

    res.status(201).json({ messageId: newMessage.id });
};

export const deleteMessage = async (
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

    const messageId = req.params.mid;

    let message;

    try {
        message = await Message.findById(messageId)
            .populate('senderId', 'id')
            .populate({
                path: 'partyId',
                populate: { path: 'host', select: 'id' }
            });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find message.',
            500
        );
        return next(error);
    }

    if (!message) {
        return next(new HttpError('Could not find message for this id.', 404));
    }

    const validUserIds = [message.senderId.id, message.partyId.host.id];

    if (!validUserIds.includes(req.userData?.userId)) {
        return next(
            new HttpError('You are not allowed to delete this message.', 401)
        );
    }

    try {
        await message.remove();
    } catch (e) {
        return next(
            new HttpError(
                'Something went wrong, could not delete message.',
                500
            )
        );
    }

    res.status(200).json({ message: 'Message deleted.' });
};
