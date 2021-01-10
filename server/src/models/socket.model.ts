/**
 * database model for socket bindings
 * association between socket and user id
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

interface ISocketBinding extends mongoose.Document {
  _id: string;
  socketId: string;
  userId: string;
  // TODO: last updated, will have worker that removes all stale binding
  timestamp: Date;
}

const SocketBindingSchema = new Schema({
  socketId: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

SocketBindingSchema.pre('save', function (this: ISocketBinding, next) {
  this.timestamp = new Date(Date.now());
  next();
});

const SocketBinding = mongoose.model<ISocketBinding>(
  'Socket Binding',
  SocketBindingSchema
);

export { SocketBinding, ISocketBinding };
