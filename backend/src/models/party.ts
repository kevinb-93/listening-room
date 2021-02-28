import mongoose, { Document } from 'mongoose';

export interface Track {
    _id: string;
}

export interface CurrentTrack extends Track {
    durationMs: number;
    elaspedMs: number;
    isPaused: boolean;
}

export interface Party extends Document {
    name: string;
    creator: string;
    host: string;
    users: string[];
    currentTrack: CurrentTrack;
    queue: Track[];
}

const Schema = mongoose.Schema;

const trackSchema = new Schema({
    _id: { type: String, default: '' }
});

const currentTrackSchema = new Schema({
    _id: { type: String, default: '' },
    durationMs: { type: Number, default: 0 },
    elaspedMs: { type: Number, default: 0 },
    isPaused: { type: Boolean, default: true }
});

const partySchema = new Schema({
    name: { type: String },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    host: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    currentTrack: { type: currentTrackSchema, default: () => ({}) },
    queue: [trackSchema]
});

export default mongoose.model<Party>('Party', partySchema);
