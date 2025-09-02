import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    description: {
      type: String,
    },
    role: {
      type: String,
      enum: ["teacher"],
      default: "teacher",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Teacher", teacherSchema);
export default User;
