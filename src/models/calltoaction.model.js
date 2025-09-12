import mongoose from "mongoose";

const subtitleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  subtext: {
    type: String,
    default: "" // Optional, or set required: true if you need it
  }
}, { _id: true }); // keep subtitle IDs

const callToActionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitles: {
    type: [subtitleSchema],
    validate: [
      arr => arr.length <= 6,
      'Maximum 6 subtitles are allowed.'
    ]
  }
});

const CallToAction = mongoose.model("CallToAction", callToActionSchema);
export default CallToAction;
