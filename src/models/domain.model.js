import mongoose from 'mongoose';

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

const Domain = mongoose.model('Domain', domainSchema);
export default Domain; 