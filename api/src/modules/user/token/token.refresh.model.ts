import mongoose, { Schema, Document } from 'mongoose';
import { UserDocument } from '../user.model';

export interface RefreshTokenDocument extends Document {
    user: mongoose.Types.ObjectId | UserDocument;
    token: string;
    expires: Date;
    created: Date;
    createdByIp: string;
    revoked: Date;
    revokedByIp: string;
    replacedByToken: string;
    isExpired: boolean;
    isActive: boolean;
}

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: String,
    expires: Date,
    created: { type: Date, default: Date.now },
    createdByIp: String,
    revoked: Date,
    revokedByIp: String,
    replacedByToken: String
});

schema.virtual('isExpired').get(function (this: RefreshTokenDocument) {
    return Date.now() >= this.expires.getTime();
});

schema.virtual('isActive').get(function (this: RefreshTokenDocument) {
    return !this.revoked && !this.isExpired;
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (_doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.user;
    }
});

export default mongoose.model<RefreshTokenDocument>('RefreshToken', schema);
