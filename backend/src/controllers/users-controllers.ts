import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import HttpError from '../models/http-error';
import User from '../models/user';
import { NextFunction, Request, Response } from 'express';
import secret from '../utils/secret';
import Party, { Party as PartyConstructor } from '../models/party';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    // validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, isHost } = req.body;

    const newUser = new User({ name, isHost });

    let newParty: PartyConstructor;

    // save new user
    try {
        await User.createCollection();
        if (isHost) {
            await Party.createCollection();
        }
        const session = await mongoose.startSession();
        session.startTransaction();

        await newUser.save({ session });
        if (isHost) {
            newParty = new Party({
                createdAt: new Date(),
                creator: newUser.id,
            });
            await newParty.save({ session });
            newUser.parties.push(newParty);
            await newUser.save({ session });
        }
        await session.commitTransaction();
    } catch (e) {
        return next(new HttpError('Auth failed, please try again later.', 500));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id, name: newUser.name },
            secret.jwtPrivateKey,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Auth failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({ userId: newUser.id, name: newUser.name, token });
};

// export const signup = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     // validate request
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return next(
//             new HttpError('Invalid inputs passed, please check your data.', 422)
//         );
//     }

//     const { name, email, password } = req.body;

//     let existingUser;

//     // check for an existing user
//     try {
//         existingUser = await User.findOne({ email });
//     } catch (e) {
//         return next(
//             new HttpError('Signing up failed, please try again later.', 500)
//         );
//     }

//     if (existingUser) {
//         return next(
//             new HttpError('User exists already, please login instead.', 422)
//         );
//     }

//     let hashedPassword;

//     try {
//         hashedPassword = await bcrypt.hash(password, 12);
//     } catch (err) {
//         return next(
//             new HttpError('Could not create user, please try again.', 500)
//         );
//     }

//     const newUser = new User({ name, email, password: hashedPassword });

//     // save new user
//     try {
//         await newUser.save();
//     } catch (e) {
//         return next(
//             new HttpError('Signing up failed, please try again later.', 500)
//         );
//     }

//     let token;
//     try {
//         token = jwt.sign(
//             { userId: newUser.id, email: newUser.email },
//             secret.jwtPrivateKey,
//             { expiresIn: '1h' }
//         );
//     } catch (err) {
//         const error = new HttpError(
//             'Signing up failed, please try again later.',
//             500
//         );
//         return next(error);
//     }

//     res.status(201).json({ userId: newUser.id, email: newUser.email, token });
// };

// export const login = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { email, password } = req.body;

//     let existingUser;

//     try {
//         existingUser = await User.findOne({ email });
//     } catch (err) {
//         return next(
//             new HttpError('Logging in failed, please try again later.', 500)
//         );
//     }

//     if (!existingUser) {
//         return next(
//             new HttpError('Invalid credentials, could not log you in.', 403)
//         );
//     }

//     let isValidPassword = false;
//     try {
//         isValidPassword = await bcrypt.compare(password, existingUser.password);
//     } catch (err) {
//         return next(
//             new HttpError(
//                 'Could not log you in, please check your credentials and try again.',
//                 500
//             )
//         );
//     }

//     if (!isValidPassword) {
//         return next(
//             new HttpError('Invalid credentials, could not log you in.', 403)
//         );
//     }

//     let token;
//     try {
//         token = jwt.sign(
//             { userId: existingUser.id, email: existingUser.email },
//             secret.jwtPrivateKey,
//             { expiresIn: '1h' }
//         );
//     } catch (err) {
//         return next(
//             new HttpError('Logging in failed, please try again later.', 500)
//         );
//     }

//     res.json({
//         userId: existingUser.id,
//         email: existingUser.email,
//         token,
//     });
// };
