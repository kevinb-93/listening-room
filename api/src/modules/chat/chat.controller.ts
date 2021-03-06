import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

import Message from './chat.model';
import Party from '../party/party.model';
import HttpError from '../../shared/models/http-error.model';
import { UserService } from '../../modules/user/user.service';

export const createMessage = async (
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

        const { message, partyId } = req.body;
        const senderId = req.user?.userId;
        if (!senderId) {
            return next(new HttpError("Sender doesn't exist", 422));
        }

        const party = await Party.findById(partyId);

        if (!party) {
            return next(new HttpError("Party doesn't exist", 422));
        }

        const newMessage = new Message({
            senderId,
            message,
            partyId: party.id
        });

        await newMessage.save();
        const sender = await UserService.getUser(senderId);

        const response = {
            id: newMessage._id,
            timestamp: newMessage._id.getTimestamp(),
            sender: { id: senderId, name: sender.userDoc.name },
            content: message
        };

        res.status(201).json(response);
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
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(
                new HttpError(
                    'Invalid inputs passed, please check your data.',
                    422
                )
            );
        }

        const messageId = req.params.messageId;

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

        res.status(200).json({
            messageId: message._id,
            partyId: message.partyId._id
        });
    } catch (e) {
        console.error(e);
        return next(new HttpError('Internal Server Error!', 500));
    }
};
