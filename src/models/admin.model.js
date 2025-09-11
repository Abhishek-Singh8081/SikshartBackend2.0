import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
  },
  isactive: { 
    type: Boolean, 
    default: true 
  },
  },
  { timestamps: true }
);

const User = mongoose.model("Admin", freelancerSchema);
export default User;
