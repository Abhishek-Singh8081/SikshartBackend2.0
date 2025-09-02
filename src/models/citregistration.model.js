import mongoose from 'mongoose';

const citRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  domain: { type: String, required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'CITTest' }, // Made optional for general registrations
  userId: { type: String }, // can be generated if not provided
  registeredAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['registered', 'completed', 'disqualified'], default: 'registered' },
  score: { type: Number, min: 0 },
  completedAt: { type: Date }
}, { timestamps: true });

const CITRegistration = mongoose.models.CITRegistration
  || mongoose.model('CITRegistration', citRegistrationSchema, 'citregistrations');

export default CITRegistration; 