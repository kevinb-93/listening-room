import mongoose, { Document } from 'mongoose';

export interface Chat extends Document {
    senderId: Document['_id'];
    partyId: Document['_id'];
    message: string;
}

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    senderId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    partyId: { type: mongoose.Types.ObjectId, required: true, ref: 'Party' },
    message: { type: String, required: true }
});

export default mongoose.model<Chat>('Chat', chatSchema);
