import mongoose from "mongoose";

const stringWithIdSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  value: { type: String, required: true },
}, { _id: false });

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

  targetAudience: [stringWithIdSchema],
  stacks: [stringWithIdSchema],
  tools: [stringWithIdSchema],
  outcomes: [stringWithIdSchema],
  perks: [stringWithIdSchema],
  requirements: [stringWithIdSchema],

  duration: String,
  priceRange: String,

  curriculum: [curriculumSchema],
}, { timestamps: true });

const Internship = mongoose.model("Internship", internshipSchema);
export default Internship;
