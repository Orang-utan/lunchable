import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IUser extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshToken: string;
  groupBelongedTo: string[];
  pastLunches: string[];
  matchStatus: string; // rest | searching | matched
}

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String, required: false },
  groupBelongedTo: { type: [String], required: true, default: [] },
  pastLunches: { type: [String], required: true, default: [] },
  matchStatus: { type: String, default: 'rest' },
});

const User = mongoose.model<IUser>('User', UserSchema);

export { User, IUser };
