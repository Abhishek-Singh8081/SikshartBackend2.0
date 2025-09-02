import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['training', 'internship'], required: true },
  domain: String,
  description: String,
  duration: String,
  mode: { type: String, enum: ['online', 'offline', 'hybrid'] },
  fees: Number,
  certificateAvailable: Boolean,
  startDate: Date,
  endDate: Date,
  thumbnail: String,
  syllabus: [String],
  createdAt: { type: Date, default: Date.now }
});

const Program = mongoose.model("Program", programSchema);
export default Program;