import mongoose from "mongoose";

const curriculumSchema = new mongoose.Schema({
  week: String,
  topic: String,
  details: String,
});

const internshipSchema = new mongoose.Schema({
  title: String,
  name: String,
  path: String,
  icon: String,
  subtitle: String,
  gradient: String,
  bgGradient: String,
  hoverGradient: String,
  slug: { type: String, unique: true },
  description: String,
  targetAudience: [String],
  stacks: [String],
  duration: String,
  tools: [String],
  priceRange: String,
  outcomes: [String],
  perks: [String],
  curriculum: [curriculumSchema],
  requirements: [String],
}, { timestamps: true });

const Internship = mongoose.model("Internship", internshipSchema);
export default Internship; 