import mongoose from "mongoose";


const subjectSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const qualificationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  title: {
    type: String,
    required: true,
  },
});

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

    city: {
      type: String,
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

    description: {
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

    resumeUrl: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["teacher"],
      default: "teacher",
    },

    refreshToken: {
      type: String,
      default: "",
    },

    otp: {
      type: String,
      default: "",
    },

    otpExpires: {
      type: Date,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    yearsOfExperience: {
      type: Number,
      required: true,
    },

    currentInstitution: {
      type: String,
      default: "",
    },

    previousInstitution: {
      type: String,
      default: "",
    },

    teachingCourses: [
      {
        type: String,
      },
    ],

    subjects: [subjectSchema],

    qualifications: [qualificationSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("Teacher", teacherSchema);
export default User;
