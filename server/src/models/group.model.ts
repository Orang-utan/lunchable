import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IGroup extends mongoose.Document {
  _id: string;
  groupName: string;
  members: string[];
}

const GroupSchema = new Schema({
  groupName: { type: String, required: true },
  members: { type: [String], required: true },
});

const Group = mongoose.model<IGroup>('Group', GroupSchema);

export { Group, IGroup };
