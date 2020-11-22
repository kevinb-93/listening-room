import mongoose, { Document } from 'mongoose';

export interface TokenDocument extends Document {
    token: string;
}

const tokenSchema = new mongoose.Schema({
    token: { type: String }
});

export default mongoose.model<TokenDocument>('Token', tokenSchema);
