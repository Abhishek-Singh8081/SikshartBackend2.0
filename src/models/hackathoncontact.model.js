import mongoose from 'mongoose';

const contactChannelSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'phone', 'whatsapp', 'linkedin', 'telegram'],
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, { _id: false });

const hackathonContactSchema = new mongoose.Schema({

  query_type: {
    type: String,
    required: true,
    enum: [
      'Media', 'Operations', 'Sponsorship', 'Technical', 
      'Registration', 'Logistics', 'Other'
    ]
  },
  name: {
    type: String,
    required: true
  },
  designation: {
    type: String, 
    required: true
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
    
     contact_channels: [contactChannelSchema], 
}, {
  timestamps: true
});

const HackathonContact = mongoose.model('HackathonContact', hackathonContactSchema);

export default HackathonContact;
