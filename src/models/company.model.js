import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    confirmPassword: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["company"], default: "company" },
    image: {    
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    companylogo:{
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },

    },

    // ✅ New Fields
    industry: { type: String, default: "" },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
      default: "1-10",
    },
    website: { type: String, default: "" },
    address: { type: String, default: "" },
    description: { type: String, default: "" },


    refreshToken: { type: String, default: "" },
    isSponser:{
      type: Boolean, default: false
    },


      otp: {
      type: String,
      default: "",
    },

    otpExpires: {
      type: Date,
    },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
