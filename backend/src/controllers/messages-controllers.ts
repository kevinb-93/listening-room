import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

import Message from '../models/message';
import Party from '../models/party';
import HttpError from '../models/http-error';
import { getIO } from '../utils/socket';

export const createMessage = async (
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

        const { message, partyId } = req.body;
        const senderId = req.user?.userId;

        const party = await Party.findById(partyId);

        if (!party) {
            return next(new HttpError("Party doesn't exist", 422));
        }

        const newMessage = new Message({
            senderId,
            message,
            partyId: party.id
        });

        // save new message
        await newMessage.save();
        getIO().emit('messages', {
            action: 'create',
            message: newMessage.toObject()
        });

        res.status(201).json({ messageId: newMessage.id });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error', 500));
    }
};

export const deleteMessage = async (
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

        const messageId = req.params.mid;

        const message = await Message.findById(messageId)
            .populate('senderId', 'id')
            .populate({
                path: 'partyId',
                populate: { path: 'host', select: 'id' }
            });

        if (!message) {
            return next(
                new HttpError('Could not find message for this id.', 404)
            );
        }

        const validUserIds = [message.senderId.id, message.partyId.host.id];

        if (!validUserIds.includes(req.user?.userId)) {
            return next(
                new HttpError(
                    'You are not allowed to delete this message.',
                    401
                )
            );
        }

        await message.remove();
        getIO().emit('messages', {
            action: 'delete',
            messageId: messageId
        });

        res.status(200).json({ message: 'Message deleted.' });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error!', 500));
    }
};
