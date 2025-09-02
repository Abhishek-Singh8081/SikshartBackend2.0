import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  domain: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  message: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  consent: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema, 'feedback'); 