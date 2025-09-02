import mongoose from 'mongoose';

// CIT Test Schema
const citTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true,
    enum: ['30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours', '40 minutes']
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  registeredParticipants: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cybersecurity', 'DevOps', 'Digital Marketing', 'UI/UX Design', 'Blockchain', 'Cloud Computing', 'General']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  instructions: [{
    type: String
  }],
  topics: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  resultsDeclared: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// CIT Registration Schema
const citRegistrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CITTest',
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'completed', 'disqualified'],
    default: 'registered'
  },
  score: {
    type: Number,
    min: 0
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// CIT Question Schema
const citQuestionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CITTest',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0
  },
  explanation: {
    type: String
  },
  points: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// CIT Test Result Schema
const citTestResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CITTest',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CITQuestion'
    },
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number // in minutes
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
citRegistrationSchema.index({ userId: 1, testId: 1 }, { unique: true });
citQuestionSchema.index({ testId: 1 });
citTestResultSchema.index({ userId: 1, testId: 1 });

const CITTest = mongoose.model('CITTest', citTestSchema);
const CITRegistration = mongoose.model('CITRegistration', citRegistrationSchema);
const CITQuestion = mongoose.model('CITQuestion', citQuestionSchema);
const CITTestResult = mongoose.model('CITTestResult', citTestResultSchema);

export {
  CITTest,
  CITRegistration,
  CITQuestion,
  CITTestResult
}; 