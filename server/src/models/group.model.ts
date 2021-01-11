import mongoose from 'mongoose';

const { Schema } = mongoose;

// sub nested document
interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface IGroup extends mongoose.Document {
  _id: string;
  groupName: string; // group display name
  groupCode: string; // group invitation code
  members: Member[]; // must have at least one member
}

const GroupSchema = new Schema({
  groupName: { type: String, required: true },
  groupCode: { type: String, required: true },
  members: {
    type: [
      {
        id: String,
        firstName: String,
        lastName: String,
        email: String,
      },
    ],
    default: [],
  },
});

const Group = mongoose.model<IGroup>('Group', GroupSchema);

export { Group, IGroup };
