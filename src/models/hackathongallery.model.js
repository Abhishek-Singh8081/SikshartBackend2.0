import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    video: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
