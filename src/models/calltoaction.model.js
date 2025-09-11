// models/calltoaction.model.js
import mongoose from "mongoose";

const subtitleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
}, { _id: true }); // ensure _id is included by default

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
