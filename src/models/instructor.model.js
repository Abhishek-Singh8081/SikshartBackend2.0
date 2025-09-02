import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, default: "Instructor" },
    avatar: { type: String, default: "" },
    rating: { type: Number, default: 4.8 },
    students: { type: Number, default: 0 },
    courses: { type: Number, default: 0 },
    experience: { type: String, default: "" },
    category: { type: String, default: "general" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    specialties: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    social: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    courseHighlights: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Instructor = mongoose.model("Instructor", instructorSchema, "instructors");
export default Instructor; 