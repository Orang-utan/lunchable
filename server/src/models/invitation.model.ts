/**
 * database model for invitation code
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IInvitation extends mongoose.Document {
  _id: string;
  code: string;
  timestamp: Date;
}

const InvitationSchema = new Schema({
  code: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Invitation = mongoose.model<IInvitation>(
  'Invitation Code',
  InvitationSchema
);

export { Invitation, IInvitation };
