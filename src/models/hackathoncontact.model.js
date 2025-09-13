import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Partner", "Sponsor", "General Query"],
      required: true,
    },
    // General Fields
    name: String,
    email: { type: String, required: true },
    phone: String,
    message: String,

    // General Query Specific
    subject: String,

    // Partner-specific fields
    fullName: String,
    jobTitle: String,
    company: String,
    companyType: String,
    country: String,
    careAbout: String,

    // Sponsor-specific fields
    organization: String,
    role: String,
    sponsorshipType: String,
    reason: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("hackathonContact", contactSchema);
