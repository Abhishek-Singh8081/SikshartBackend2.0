import mongoose from 'mongoose';

const registeredBySchema = new mongoose.Schema({
  user_type: {
    type: String,
    enum: ['student', 'freelancer'],
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Dynamic reference based on user_type
    refPath: 'user_type' 
  }
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  organization: { type: String },
  current_designation: { type: String },
  years_of_experience: { type: Number, min: 0 },
  
  registered_by: {
    type: registeredBySchema,
    required: false
  }

});

const participantSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  phone: { type: String },
  organization: { type: String },
  current_designation: { type: String },
  years_of_experience: { type: Number, min: 0 },

  
  registered_by: {
    type: registeredBySchema,
    required: false
  }

 
});

const hackathonRegistrationSchema = new mongoose.Schema({
  hackathon_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Hackathon", 
    required: true 
  },

  participation_type: {
    type: String,
    enum: ['individual', '2', '3', '4', '5'],
    required: true
  },

  is_team_registration: { 
    type: Boolean, 
    default: false 
  },


  individual: participantSchema,

  
  team_name: { type: String },
  team_leader: participantSchema,
  team_members: [teamMemberSchema],

  
  why_do_you_want_to_participate: {
    type: String,
    required: true
  },

  agree_to_terms: {
    type: Boolean,
    required: true
  },

  is_payment_required: {
    type: Boolean,
    default: false,
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    required: true
  },
  payment_reference: {
    type: String,
    default: null
  },
  paid_amount: {
    type: Number,
    default: 0
  },
  payment_mode: {
    type: String,
    default: null
  },

  created_at: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

const HackathonRegistration = mongoose.model('HackathonRegistration', hackathonRegistrationSchema);

export default HackathonRegistration;
