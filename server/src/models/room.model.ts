import mongoose from 'mongoose';

const { Schema } = mongoose;

// sub nested document
interface Participant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface IRoom extends mongoose.Document {
  _id: string; // serves as the url
  participants: Participant[]; // custom participant interface
  maxParticipants: number;
  creatorId: string;
  completed: boolean;
  timestamp: Date;
}

const RoomSchema = new Schema({
  participants: {
    type: [
      {
        id: String,
        firstName: String,
        lastName: String,
        email: String,
      },
    ],
    required: true,
  },
  maxParticipants: { type: Number, required: true },
  creatorId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export { Room, IRoom };
