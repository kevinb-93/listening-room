import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { Party } from '../party/party.model';
import { AccessToken } from './token/token.access';
import { RefreshToken, SignedPayload } from './token/token.refresh';

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
    createAccessToken(): Promise<string | undefined>;
    createRefreshToken(): Promise<SignedPayload | undefined>;
}

const userSchema = new mongoose.Schema({
    name: { type: String },
    password: { type: String },
    role: { type: String },
    lastLoginAt: { type: Date },
    isAnonymous: { type: Boolean },
    accessToken: { type: String },
    party: { type: mongoose.Types.ObjectId, ref: 'Party' }
});

userSchema.methods.createAccessToken = async function () {
    try {
        const { _id, name, role } = this;
        const token = new AccessToken({ userId: _id, name, role });
        return token.signedPayload;
    } catch (e) {
        console.error(e);
    }
};

userSchema.methods.createRefreshToken = async function () {
    try {
        const { _id } = this;

        const token = new RefreshToken(_id, 'ip');
        return token;
    } catch (e) {
        console.error(e);
    }
};

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.passwordHash;
    }
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<UserDocument>('User', userSchema);
