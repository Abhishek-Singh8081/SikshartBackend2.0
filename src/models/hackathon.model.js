import mongoose from "mongoose";

const leagueFormatSchema = new mongoose.Schema(
  {
    stage: { type: String, required: true },
    start_datetime: { type: Date, required: true },
    end_datetime: { type: Date, required: true },
    description: { type: String, required: true },
  },
  { _id: true }
);

const prizePoolSchema = new mongoose.Schema(
  {
    rank: { type: String, required: true },
    description: { type: String, required: true },
    amount_inr: { type: Number, required: true },
    amount_usd: { type: Number },
    teams_selected: { type: Number },
  },
  { _id: true }
);

const benefitSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { _id: true }
);

const hackathonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String },

    poster_image: {
      url: { type: String },
      public_id: { type: String },
    },

    event_type: {
      type: String,
      enum: ["hackathon", "ideathon", "incubation"],
      required: true,
    },

    hackathon_type: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: true,
    },

    is_paid: {
      type: Boolean,
      required: true,
    },

    amount_inr: {
      type: Number,
      required: function () {
        return this.is_paid === true;
      },
      min: [0, "Amount must be positive."],
    },
    amount_usd: {
      type: Number,
      min: 0,
    },

    // ✅ Add location field
    location: {
      type: String,
      required: function () {
        return this.hackathon_type === 'offline' || this.hackathon_type === 'hybrid';
      },
    },

    benefits: [benefitSchema],

    conducted_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
        required: false,
      }
    ],

    hackathon_dates: {
      start_date: { type: Date, required: true },
      end_date: { type: Date, required: true },
    },

    league_format: [leagueFormatSchema],
    prize_pool: [prizePoolSchema],
  },
  { timestamps: true }
);


const Hackathon = mongoose.model("Hackathon", hackathonSchema);
export default Hackathon;
