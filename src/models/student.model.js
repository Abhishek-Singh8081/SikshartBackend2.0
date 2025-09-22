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

    city: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    collegeName: {
      type: String,
      required: true,
    },

    courseName: {
      type: String,
      required: true,
    },

    yearOfStudy: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    confirmPassword: {
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
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
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

    // OTP-related fields
    otp: {
      type: String,
      default: "",
    },

    otpExpires: {
      type: Date,
    },

    // ✅ New fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
