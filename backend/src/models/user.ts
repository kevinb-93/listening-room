import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { Party } from './party';
import Token from '../models/token';
import { createToken, TokenTypes } from '../utils/token';

export enum UserType {
    Guest,
    Host
}

export interface UserDocument extends Document {
    name: string;
    userType: UserType;
    party: Party;
    createAccessToken(): Promise<string | undefined>;
    createRefreshToken(): Promise<string | undefined>;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    userType: { type: Number, required: true },
    party: { type: mongoose.Types.ObjectId, ref: 'Party' }
});

userSchema.methods.createAccessToken = async function () {
    try {
        const { _id, name } = this;

        return createToken({ userId: _id, name, type: TokenTypes.Access });
    } catch (e) {
        console.error(e);
    }
};

userSchema.methods.createRefreshToken = async function () {
    try {
        const { _id, name } = this;

        const token = createToken({
            userId: _id,
            name,
            type: TokenTypes.Refresh
        });

        await new Token({ token }).save();

        return token;
    } catch (e) {
        console.error(e);
    }
};

userSchema.plugin(uniqueValidator);

export default mongoose.model<UserDocument>('User', userSchema);
