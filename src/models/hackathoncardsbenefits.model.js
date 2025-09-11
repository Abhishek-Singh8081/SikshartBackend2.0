// models/card.model.js
import mongoose from "mongoose";

const benefitscardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  benefit: {
    type: String,
    required: true
  }
});

const Hackathonbenefits = mongoose.model("Hackathonbenefit", benefitscardSchema);
export default Hackathonbenefits;
