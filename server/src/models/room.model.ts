import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IRoom extends mongoose.Document {
  _id: string; // serves as the url
  participants: string[]; // user id
  maxParticipants: number;
  creatorId: string;
}

const RoomSchema = new Schema({
  participants: { type: [String], required: true },
  maxParticipants: { type: Number, required: true },
  creatorId: { type: String, required: true },
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export { Room, IRoom };
