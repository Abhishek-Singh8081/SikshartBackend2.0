// backend/scripts/seedInternshipTest.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CITTest, CITQuestion } from '../src/models/cit.model.js';

dotenv.config();

const MOCK_QUESTIONS = [
  // Section A: General Aptitude (10)
  {
    text: "What is 12 + 15?",
    options: ["25", "27", "30", "32"],
    correctAnswerIndex: 1,
    explanation: "12 + 15 = 27"
  },
  {
    text: "If a train travels 60 km in 1.5 hours, what is its average speed?",
    options: ["30 km/h", "40 km/h", "45 km/h", "50 km/h"],
    correctAnswerIndex: 1,
    explanation: "60 / 1.5 = 40 km/h"
  },
  {
    text: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
    options: ["18", "24", "32", "36"],
    correctAnswerIndex: 2,
    explanation: "Each number is multiplied by 2; next is 16*2=32"
  },
  {
    text: "A shopkeeper sells an item for ₹120 at a loss of 20%. What was the cost price?",
    options: ["₹100", "₹125", "₹140", "₹150"],
    correctAnswerIndex: 3,
    explanation: "CP = SP / (1 - loss%) = 120 / 0.8 = 150"
  },
  {
    text: "If 5x = 20, what is x?",
    options: ["2", "3", "4", "5"],
    correctAnswerIndex: 2,
    explanation: "x = 20 / 5 = 4"
  },
  {
    text: "What is 15% of 200?",
    options: ["20", "25", "30", "35"],
    correctAnswerIndex: 2,
    explanation: "15% of 200 = (15/100) × 200 = 30"
  },
  {
    text: "If a rectangle has length 8 and width 6, what is its area?",
    options: ["14", "28", "48", "56"],
    correctAnswerIndex: 2,
    explanation: "Area = length × width = 8 × 6 = 48"
  },
  {
    text: "What is the value of 3² + 4²?",
    options: ["7", "12", "25", "49"],
    correctAnswerIndex: 2,
    explanation: "3² + 4² = 9 + 16 = 25"
  },
  {
    text: "If 3 workers can complete a task in 6 days, how many days will 2 workers take?",
    options: ["4", "6", "9", "12"],
    correctAnswerIndex: 2,
    explanation: "More workers = fewer days. 3×6 = 2×x, so x = 9"
  },
  {
    text: "What is the average of 10, 20, 30, 40, 50?",
    options: ["25", "30", "35", "40"],
    correctAnswerIndex: 1,
    explanation: "Average = (10+20+30+40+50)/5 = 150/5 = 30"
  },

  // Section B: Basic Reasoning (10)
  {
    text: "Find the odd one out: Apple, Orange, Banana, Carrot",
    options: ["Apple", "Orange", "Banana", "Carrot"],
    correctAnswerIndex: 3,
    explanation: "Carrot is a vegetable, others are fruits."
  },
  {
    text: "If CAT is coded as DBU, how is DOG coded?",
    options: ["EPH", "EPI", "DPH", "EOG"],
    correctAnswerIndex: 0,
    explanation: "Each letter is shifted by +1."
  },
  {
    text: "Which number should come next: 3, 6, 12, 24, ...?",
    options: ["36", "48", "50", "60"],
    correctAnswerIndex: 1,
    explanation: "Each number is multiplied by 2."
  },
  {
    text: "Which is the mirror image of 'b'?",
    options: ["d", "p", "q", "b"],
    correctAnswerIndex: 0,
    explanation: "'b' and 'd' are mirror images."
  },
  {
    text: "If all BLOOMS are FLOWERS and some FLOWERS are RED, are all BLOOMS RED?",
    options: ["Yes", "No", "Cannot be determined", "Some are"],
    correctAnswerIndex: 2,
    explanation: "Cannot be determined from the given info."
  },
  {
    text: "Find the missing number: 2, 6, 12, 20, ?",
    options: ["30", "32", "35", "40"],
    correctAnswerIndex: 0,
    explanation: "Difference increases by 2: +4, +6, +8, +10. So 20+10=30"
  },
  {
    text: "If RED is to STOP, then GREEN is to?",
    options: ["GO", "WAIT", "SLOW", "CAUTION"],
    correctAnswerIndex: 0,
    explanation: "Red means stop, green means go in traffic signals."
  },
  {
    text: "Which letter comes next: A, C, E, G, ?",
    options: ["H", "I", "J", "K"],
    correctAnswerIndex: 1,
    explanation: "Skip one letter: A, C, E, G, I"
  },
  {
    text: "If 5+3=28, 9+1=810, then 8+6=?",
    options: ["214", "514", "614", "714"],
    correctAnswerIndex: 1,
    explanation: "Pattern: (a+b) followed by (a-b). So 8+6=14, 8-6=2, answer is 214"
  },
  {
    text: "Which word doesn't belong: Happy, Joyful, Sad, Cheerful",
    options: ["Happy", "Joyful", "Sad", "Cheerful"],
    correctAnswerIndex: 2,
    explanation: "Sad is the opposite of the other positive emotions."
  },

  // Section C: English (10)
  {
    text: "Choose the correct spelling:",
    options: ["Recieve", "Receive", "Recive", "Receeve"],
    correctAnswerIndex: 1,
    explanation: "The correct spelling is 'Receive'."
  },
  {
    text: "Fill in the blank: She ___ to school every day.",
    options: ["go", "goes", "going", "gone"],
    correctAnswerIndex: 1,
    explanation: "'She goes' is correct."
  },
  {
    text: "What is the synonym of 'Happy'?",
    options: ["Sad", "Angry", "Joyful", "Tired"],
    correctAnswerIndex: 2,
    explanation: "'Joyful' is a synonym for 'Happy'."
  },
  {
    text: "Choose the correct passive form: 'He writes a letter.'",
    options: [
      "A letter is written by him.",
      "A letter was written by him.",
      "A letter is being written by him.",
      "A letter has been written by him."
    ],
    correctAnswerIndex: 0,
    explanation: "Present simple passive: 'A letter is written by him.'"
  },
  {
    text: "Identify the adjective: 'The quick brown fox jumps over the lazy dog.'",
    options: ["fox", "jumps", "quick", "over"],
    correctAnswerIndex: 2,
    explanation: "'Quick' describes the fox."
  },
  {
    text: "What is the plural of 'child'?",
    options: ["childs", "children", "childes", "child's"],
    correctAnswerIndex: 1,
    explanation: "The plural of 'child' is 'children'."
  },
  {
    text: "Choose the correct word: The weather is ___ today.",
    options: ["good", "well", "better", "best"],
    correctAnswerIndex: 0,
    explanation: "'Good' is an adjective describing the weather."
  },
  {
    text: "What is the past tense of 'run'?",
    options: ["runned", "ran", "running", "runs"],
    correctAnswerIndex: 1,
    explanation: "The past tense of 'run' is 'ran'."
  },
  {
    text: "Identify the noun: 'The beautiful sunset amazed everyone.'",
    options: ["beautiful", "sunset", "amazed", "everyone"],
    correctAnswerIndex: 1,
    explanation: "'Sunset' is the main noun in the sentence."
  },
  {
    text: "What is the antonym of 'big'?",
    options: ["large", "huge", "small", "tall"],
    correctAnswerIndex: 2,
    explanation: "'Small' is the opposite of 'big'."
  },

  // Section D: Current Affairs (10)
  {
    text: "Who is the current President of India? (2024)",
    options: ["Ram Nath Kovind", "Droupadi Murmu", "Narendra Modi", "Amit Shah"],
    correctAnswerIndex: 1,
    explanation: "Droupadi Murmu is the President as of 2024."
  },
  {
    text: "Which country hosted the 2023 Cricket World Cup?",
    options: ["Australia", "India", "England", "South Africa"],
    correctAnswerIndex: 1,
    explanation: "India hosted the 2023 Cricket World Cup."
  },
  {
    text: "Which is the latest mission of ISRO to the Moon?",
    options: ["Chandrayaan-1", "Chandrayaan-2", "Chandrayaan-3", "Mangalyaan"],
    correctAnswerIndex: 2,
    explanation: "Chandrayaan-3 is the latest."
  },
  {
    text: "Which city will host the 2028 Olympics?",
    options: ["Paris", "Los Angeles", "Tokyo", "London"],
    correctAnswerIndex: 1,
    explanation: "Los Angeles will host the 2028 Olympics."
  },
  {
    text: "What is the theme of World Environment Day 2024?",
    options: [
      "Beat Plastic Pollution",
      "Ecosystem Restoration",
      "Land Restoration, Desertification and Drought Resilience",
      "Only One Earth"
    ],
    correctAnswerIndex: 2,
    explanation: "2024 theme is 'Land Restoration, Desertification and Drought Resilience'."
  },
  {
    text: "Which country won the 2023 Cricket World Cup?",
    options: ["India", "Australia", "England", "New Zealand"],
    correctAnswerIndex: 1,
    explanation: "Australia won the 2023 Cricket World Cup."
  },
  {
    text: "Who is the current Prime Minister of India? (2024)",
    options: ["Manmohan Singh", "Narendra Modi", "Rahul Gandhi", "Amit Shah"],
    correctAnswerIndex: 1,
    explanation: "Narendra Modi is the current Prime Minister of India."
  },
  {
    text: "Which city hosted the 2024 G20 Summit?",
    options: ["New Delhi", "Mumbai", "Bangalore", "Chennai"],
    correctAnswerIndex: 0,
    explanation: "New Delhi hosted the 2024 G20 Summit."
  },
  {
    text: "What is India's national animal?",
    options: ["Lion", "Tiger", "Elephant", "Peacock"],
    correctAnswerIndex: 1,
    explanation: "The Bengal Tiger is India's national animal."
  },
  {
    text: "Which is India's first indigenous aircraft carrier?",
    options: ["INS Vikrant", "INS Vikramaditya", "INS Viraat", "INS Vishal"],
    correctAnswerIndex: 0,
    explanation: "INS Vikrant is India's first indigenous aircraft carrier."
  }
];

// User's new current affairs questions
const USER_CURRENT_AFFAIRS_QUESTIONS = [
  {
    text: "Who is the current President of India as of July 2025?",
    options: ["Droupadi Murmu", "Ram Nath Kovind", "Narendra Modi", "Amit Shah"],
    correctAnswerIndex: 0,
    explanation: "Droupadi Murmu is the 15th President of India.",
    points: 1
  },
  {
    text: "Which country hosted the G20 Summit in 2024?",
    options: ["India", "USA", "Brazil", "Italy"],
    correctAnswerIndex: 2,
    explanation: "Brazil hosted the 2024 G20 Summit.",
    points: 1
  },
  {
    text: "Which Indian startup became a unicorn in AI healthcare in 2025?",
    options: ["HealthifyMe", "CureAI", "Qure.ai", "Niramai"],
    correctAnswerIndex: 2,
    explanation: "Qure.ai crossed $1B valuation in 2025.",
    points: 1
  },
  {
    text: "What is the name of India’s AI mission launched in 2025?",
    options: ["AI Shakti", "IndiaAI", "Digital Bharat", "AI Yatra"],
    correctAnswerIndex: 1,
    explanation: "IndiaAI is the official national AI mission launched in 2025.",
    points: 1
  },
  {
    text: "Who won the 2025 ICC T20 World Cup?",
    options: ["India", "Australia", "England", "Pakistan"],
    correctAnswerIndex: 0,
    explanation: "India won the 2025 T20 World Cup.",
    points: 1
  },
  {
    text: "Which tech company recently unveiled a GPT-5 competitor named 'Synapse'?",
    options: ["Meta", "Google", "Anthropic", "Apple"],
    correctAnswerIndex: 0,
    explanation: "Meta unveiled 'Synapse' as a GPT-5 competitor in 2025.",
    points: 1
  },
  {
    text: "Which Indian state announced a Universal Basic Income pilot in 2025?",
    options: ["Kerala", "Delhi", "Rajasthan", "Karnataka"],
    correctAnswerIndex: 3,
    explanation: "Karnataka launched UBI pilot for rural areas.",
    points: 2
  },
  {
    text: "What is the full form of IN-SPACe, India’s private space launch regulator?",
    options: [
      "Indian Space Policy and Commercial Enterprise",
      "Indian National Space Promotion and Authorization Center",
      "International Space Projects and Aerospace Commission",
      "Indian Navigation, Science, and Planetary Commission"
    ],
    correctAnswerIndex: 1,
    explanation: "IN-SPACe: Indian National Space Promotion and Authorization Center.",
    points: 1
  },
  {
    text: "Which country launched the first AI-powered satellite constellation for weather prediction in 2025?",
    options: ["China", "USA", "Japan", "India"],
    correctAnswerIndex: 0,
    explanation: "China launched AI-enabled satellite constellation for predictive weather modeling.",
    points: 1
  },
  {
    text: "Which Indian city hosted the 2025 World Startup Summit?",
    options: ["Bangalore", "Delhi", "Hyderabad", "Mumbai"],
    correctAnswerIndex: 0,
    explanation: "Bangalore hosted the 2025 World Startup Summit.",
    points: 1
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

async function seedInternshipTest() {
  await connectDB();

  // Check if test already exists
  const existingTest = await CITTest.findOne({ title: "Internship Test" });
  if (existingTest) {
    console.log("Test already exists. Aborting seed.");
    process.exit(0);
  }

  // Create the test
  const test = await CITTest.create({
    title: "Internship Test",
    description: "A comprehensive test covering Aptitude, Reasoning, English, and Current Affairs.",
    startDate: new Date(), // Set as needed
    duration: "40 minutes",
    maxParticipants: 100,
    category: "General",
    difficulty: "Intermediate",
    instructions: [
      "Read each question carefully.",
      "You have 40 minutes to complete the test.",
      "Each question has only one correct answer."
    ],
    topics: ["Aptitude", "Reasoning", "English", "Current Affairs"]
  });

  // Section mapping
  const sections = [
    { name: "Section A", topic: "General Aptitude", start: 0, end: 10 },
    { name: "Section B", topic: "Basic Reasoning", start: 10, end: 20 },
    { name: "Section C", topic: "English", start: 20, end: 30 },
    { name: "Section D", topic: "Current Affairs", start: 30, end: 40 }
  ];

  let allQuestions = [];
  for (const section of sections) {
    const questions = MOCK_QUESTIONS.slice(section.start, section.end).map(q => ({
      testId: test._id,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswerIndex,
      explanation: q.explanation || "",
      points: 1,
      section: section.name,
      topic: section.topic
    }));
    allQuestions = allQuestions.concat(questions);
  }

  // After allQuestions is created, append user's questions to Section D
  const sectionD = sections.find(s => s.name === "Section D");
  if (sectionD) {
    const userQuestions = USER_CURRENT_AFFAIRS_QUESTIONS.map(q => ({
      testId: test._id,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswerIndex,
      explanation: q.explanation || "",
      points: q.points || 1,
      section: sectionD.name,
      topic: sectionD.topic
    }));
    allQuestions = allQuestions.concat(userQuestions);
  }

  await CITQuestion.insertMany(allQuestions);
  console.log("Internship Test and questions seeded successfully!");
  process.exit(0);
}

seedInternshipTest();