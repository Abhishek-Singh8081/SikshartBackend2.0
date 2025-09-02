import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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

    role: {
      type: String,
      enum: ["student"],
      default: "student",
    },

    resumeUrl: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    enrolledProgram: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Student", studentSchema);
export default User;
