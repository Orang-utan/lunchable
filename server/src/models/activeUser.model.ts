import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IActiveUser extends mongoose.Document {
  _id: string; // serves as the url
  userId: string;
}

const ActiveUserSchema = new Schema({
  userId: { type: Number, required: true },
});

const ActiveUser = mongoose.model<IActiveUser>('Active User', ActiveUserSchema);

export { ActiveUser, IActiveUser };
