import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  resumeUrl: String,
  status: {
    type: String,
    enum: ['applied', 'accepted', 'rejected', 'completed'],
    default: 'applied'
  },
  appliedAt: { type: Date, default: Date.now },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  domain: { type: String },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;