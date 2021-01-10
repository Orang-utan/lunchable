import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IFeedback extends mongoose.Document {
  _id: string;
  creatorId: string;
  timestamp: Date;
  feedback: string; // unstructured blob right now
}

const FeedbackSchema = new Schema({
  creatorId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  feedback: { type: String, required: true },
});

const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export { Feedback, IFeedback };
