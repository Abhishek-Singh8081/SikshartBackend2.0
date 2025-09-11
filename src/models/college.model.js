import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    collegeName: {
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

    address: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    accreditation: {
      type: String,
      default: "",
    },

    establishedYear: {
      type: Number,
      required: true,
    },
    

    studentCount: {
      type: Number,
      default: 0,
    },

    collegeWebsite: {
      type: String,
      default: "",
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
    state:{
type: String,
required: true,
    },
    collegeImage:{
      url: { type: String },
      public_id: { type: String },
    },

    role: {
      type: String,
      enum: ["college"],
      default: "college",
    },
  },
  { timestamps: true }
);

const College = mongoose.model("College", collegeSchema);
export default College;
