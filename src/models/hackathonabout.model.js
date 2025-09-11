// models/AboutPage.js
import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    }, // e.g. "why-join", "prizes", "faq"

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    icon: {
      type: String, // e.g., "fa-solid fa-bolt" or custom
    },

 

    visible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const aboutPageSchema = new mongoose.Schema(
  {
    headline: { type: String, required: true },

    intro: {
      type: String,
      required: true,
    }, // Markdown / HTML optional based on frontend

    banner_image: {
      url: String,
      public_id: String,
      alt: String,
    },

    sections: [sectionSchema],

    metaTitle: {
      type: String,
      default: "About HackHub | Innovate & Build",
    },

    metaDescription: {
      type: String,
      default: "Learn more about HackHub - India's most engaging hackathon platform for students.",
    },

   


  },
  { timestamps: true }
);

const AboutPage = mongoose.model("AboutPage", aboutPageSchema);
export default AboutPage;
