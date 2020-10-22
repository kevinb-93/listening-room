import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<User>('User', userSchema);
