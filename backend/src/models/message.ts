import mongoose, { Document } from 'mongoose';

export interface Message extends Document {
    senderId: Document['_id'];
    partyId: Document['_id'];
    message: string;
}

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    partyId: { type: mongoose.Types.ObjectId, required: true, ref: 'Party' },
    message: { type: String, required: true },
});

// messageSchema.virtual('admin', {
//     ref: 'Party',
//     localField: 'name',
//     foreignField: 'band',
// });

export default mongoose.model<Message>('Message', messageSchema);
