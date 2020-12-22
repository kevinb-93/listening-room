import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';

import { Party } from './party';
import secret from '../config/secret';
import Token from '../models/token';
import { TokenPayload } from 'typings/token';

export enum UserType {
    Guest,
    Host
}

export interface UserDocument extends Document {
    name: string;
    userType: UserType;
    parties: Party[];
    createAccessToken(): Promise<string | undefined>;
    createRefreshToken(): Promise<string | undefined>;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    userType: { type: Number, required: true },
    parties: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Party' }]
});

userSchema.methods.createAccessToken = async function () {
    try {
        const { _id, name } = this;
        const accessToken = jwt.sign(
            { userId: _id, name } as TokenPayload,
            secret.ACCESS_TOKEN_KEY,
            {
                expiresIn: '1m'
            }
        );
        return accessToken;
    } catch (e) {
        console.error(e);
    }
};

userSchema.methods.createRefreshToken = async function () {
    try {
        const { _id, name } = this;
        const refreshToken = jwt.sign(
            { userId: _id, name } as TokenPayload,
            secret.REFRESH_TOKEN_KEY,
            {
                expiresIn: '12h'
            }
        );
        await new Token({ token: refreshToken }).save();
        return refreshToken;
    } catch (e) {
        console.error(e);
    }
};

userSchema.plugin(uniqueValidator);

export default mongoose.model<UserDocument>('User', userSchema);
