import mongoose from 'mongoose';

const hackathonSpeakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  profileImage: {
    url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
  },
}, {
  timestamps: true,
});

const HackathonSpeaker = mongoose.model('HackathonSpeaker', hackathonSpeakerSchema);

export default HackathonSpeaker;
