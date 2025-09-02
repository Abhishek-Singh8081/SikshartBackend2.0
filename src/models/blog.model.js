import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    heroImageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,

      enum: ["student", "college", "startup", "general"],
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      avatarUrl: {
        type: String,
        trim: true,
      },
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    readingTimeMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
