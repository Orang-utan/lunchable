import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IRoom extends mongoose.Document {
  _id: string; // serves as the url
  participants: string[]; // user id
  maxParticipants: number;
  creatorId: string;
  completed: boolean;
  timestamp: Date;
}

const RoomSchema = new Schema({
  participants: { type: [String], required: true },
  maxParticipants: { type: Number, required: true },
  creatorId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export { Room, IRoom };
