import mongoose, { Document } from 'mongoose';

export interface Party extends Document {
    creator: string;
    host: string;
    users: string[];
}

const Schema = mongoose.Schema;

const partySchema = new Schema({
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    host: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

export default mongoose.model<Party>('Party', partySchema);
