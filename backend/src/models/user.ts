import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { Party } from './party';
import { createToken, TokenType } from '../utils/token';

export enum UserRole {
    User = 'user',
    Admin = 'admin'
}

export interface UserDocument extends Document {
    name: string;
    party: Party;
    password: string;
    role: UserRole;
    lastLoginAt: Date;
    isAnonymous: boolean;
    accessToken: string | undefined;
    refreshToken: string | undefined;
    createAccessToken(): Promise<string | undefined>;
    createRefreshToken(): Promise<string | undefined>;
}

const userSchema = new mongoose.Schema({
    name: { type: String },
    password: { type: String },
    role: { type: String },
    lastLoginAt: { type: Date },
    isAnonymous: { type: Boolean },
    accessToken: { type: String },
    refreshToken: { type: String },
    party: { type: mongoose.Types.ObjectId, ref: 'Party' }
});

userSchema.methods.createAccessToken = async function () {
    try {
        const { _id, name, role } = this;

        const token = createToken({
            userId: _id,
            name,
            role,
            type: TokenType.Access
        });
        return token;
    } catch (e) {
        console.error(e);
    }
};

userSchema.methods.createRefreshToken = async function () {
    try {
        const { _id, name, role } = this;

        const token = createToken({
            userId: _id,
            name,
            role,
            type: TokenType.Refresh
        });

        this.refreshToken = token;
        return token;
    } catch (e) {
        console.error(e);
    }
};

userSchema.plugin(uniqueValidator);

export default mongoose.model<UserDocument>('User', userSchema);
