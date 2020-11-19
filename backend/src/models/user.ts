import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { Party } from './party';

export interface User extends Document {
    name: string;
    parties: Party[];
}

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
    name: { type: String, required: true, unique: true },
    parties: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Party' }]
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<User>('User', userSchema);
