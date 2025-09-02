import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CITTest, CITQuestion } from '../src/models/cit.model.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleTests = [
  {
    title: "Web Development Fundamentals",
    description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals. This test covers basic web development concepts and best practices.",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    duration: "1 hour",
    maxParticipants: 50,
    category: "Web Development",
    difficulty: "Beginner",
    instructions: [
      "Read each question carefully",
      "You have 60 minutes to complete the test",
      "Each question has only one correct answer",
      "You cannot go back to previous questions once submitted"
    ],
    topics: ["HTML", "CSS", "JavaScript", "Web Fundamentals"]
  },
  {
    title: "React.js Advanced Concepts",
    description: "Advanced React.js test covering hooks, context, performance optimization, and modern React patterns.",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    duration: "1.5 hours",
    maxParticipants: 30,
    category: "Web Development",
    difficulty: "Advanced",
    instructions: [
      "This is an advanced level test",
      "You have 90 minutes to complete",
      "Focus on React best practices",
      "Consider performance implications"
    ],
    topics: ["React Hooks", "Context API", "Performance", "State Management"]
  },
  {
    title: "Data Science Essentials",
    description: "Comprehensive test covering Python, statistics, and machine learning fundamentals for data science.",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    duration: "2 hours",
    maxParticipants: 40,
    category: "Data Science",
    difficulty: "Intermediate",
    instructions: [
      "This test includes coding questions",
      "You have 120 minutes to complete",
      "Show your work for calculations",
      "Use Python for coding questions"
    ],
    topics: ["Python", "Statistics", "Machine Learning", "Data Analysis"]
  },
  {
    title: "Cybersecurity Basics",
    description: "Test your understanding of cybersecurity fundamentals, network security, and common threats.",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    duration: "1 hour",
    maxParticipants: 35,
    category: "Cybersecurity",
    difficulty: "Beginner",
    instructions: [
      "Focus on security best practices",
      "You have 60 minutes to complete",
      "Think like a security professional",
      "Consider real-world scenarios"
    ],
    topics: ["Network Security", "Threats", "Best Practices", "Cryptography"]
  }
];

const sampleQuestions = {
  "Web Development Fundamentals": [
    {
      text: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language"
      ],
      correctAnswer: 0,
      explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
    },
    {
      text: "Which CSS property is used to change the text color of an element?",
      options: ["text-color", "color", "font-color", "text-style"],
      correctAnswer: 1,
      explanation: "The 'color' property is used to set the text color of an element in CSS."
    },
    {
      text: "What is the correct way to declare a JavaScript variable?",
      options: ["var carName;", "v carName;", "variable carName;", "let carName;"],
      correctAnswer: 3,
      explanation: "In modern JavaScript, 'let' is the preferred way to declare variables as it has block scope."
    },
    {
      text: "Which HTML tag is used to create a hyperlink?",
      options: ["<a>", "<link>", "<href>", "<hyperlink>"],
      correctAnswer: 0,
      explanation: "The <a> tag defines a hyperlink in HTML."
    },
    {
      text: "Which property is used to change the background color in CSS?",
      options: ["background-color", "color-background", "bgcolor", "backgroundStyle"],
      correctAnswer: 0,
      explanation: "'background-color' is the correct CSS property for background color."
    },
    {
      text: "Which symbol is used for single-line comments in JavaScript?",
      options: ["//", "<!-- -->", "#", "/* */"],
      correctAnswer: 0,
      explanation: "// is used for single-line comments in JavaScript."
    },
    {
      text: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheet", "Colorful Style Syntax"],
      correctAnswer: 0,
      explanation: "CSS stands for Cascading Style Sheets."
    },
    {
      text: "Which attribute is used to provide an alternate text for an image in HTML?",
      options: ["alt", "title", "src", "longdesc"],
      correctAnswer: 0,
      explanation: "The 'alt' attribute provides alternate text for images."
    },
    {
      text: "How do you select an element with id 'header' in CSS?",
      options: ["#header", ".header", "header", "*header"],
      correctAnswer: 0,
      explanation: "#header selects the element with id 'header'."
    },
    {
      text: "Which method is used to output data to the console in JavaScript?",
      options: ["console.log()", "print()", "echo()", "write()"],
      correctAnswer: 0,
      explanation: "console.log() is used to print output to the browser console."
    }
  ],
  "React.js Advanced Concepts": [
    {
      text: "What is the purpose of the useEffect hook?",
      options: [
        "To create new components",
        "To perform side effects in functional components",
        "To manage state in class components",
        "To handle form submissions"
      ],
      correctAnswer: 1,
      explanation: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM."
    },
    {
      text: "What is the difference between useState and useReducer?",
      options: [
        "There is no difference",
        "useState is for simple state, useReducer for complex state logic",
        "useReducer is deprecated",
        "useState is only for numbers"
      ],
      correctAnswer: 1,
      explanation: "useState is best for simple state management, while useReducer is better for complex state logic that involves multiple sub-values."
    },
    {
      text: "Which hook is used to access context in a functional component?",
      options: ["useContext", "useRef", "useMemo", "useCallback"],
      correctAnswer: 0,
      explanation: "useContext is used to access context in functional components."
    },
    {
      text: "What does the useRef hook return?",
      options: ["A mutable ref object", "A state value", "A callback function", "A reducer function"],
      correctAnswer: 0,
      explanation: "useRef returns a mutable ref object whose .current property is initialized to the passed argument."
    },
    {
      text: "Which hook is used for memoizing expensive calculations?",
      options: ["useMemo", "useEffect", "useState", "useCallback"],
      correctAnswer: 0,
      explanation: "useMemo is used to memoize expensive calculations."
    },
    {
      text: "What is the second argument of useEffect used for?",
      options: ["Dependency array", "Callback function", "Cleanup function", "Return value"],
      correctAnswer: 0,
      explanation: "The second argument of useEffect is the dependency array."
    },
    {
      text: "How do you optimize a component to prevent unnecessary re-renders?",
      options: ["React.memo", "useEffect", "useRef", "useState"],
      correctAnswer: 0,
      explanation: "React.memo is used to optimize functional components by memoizing them."
    },
    {
      text: "Which hook is used to perform cleanup in a component?",
      options: ["useEffect", "useCleanup", "useState", "useReducer"],
      correctAnswer: 0,
      explanation: "Cleanup is performed in the return function of useEffect."
    },
    {
      text: "What is the main use of useCallback hook?",
      options: ["Memoize callback functions", "Create refs", "Manage state", "Access context"],
      correctAnswer: 0,
      explanation: "useCallback is used to memoize callback functions."
    },
    {
      text: "Which hook is used to manage state in a functional component?",
      options: ["useState", "useEffect", "useRef", "useMemo"],
      correctAnswer: 0,
      explanation: "useState is used to manage state in functional components."
    }
  ],
  "Data Science Essentials": [
    {
      text: "What is the primary purpose of NumPy in Python?",
      options: [
        "Web development",
        "Numerical computing and array operations",
        "Database management",
        "GUI development"
      ],
      correctAnswer: 1,
      explanation: "NumPy is primarily used for numerical computing and efficient array operations in Python."
    },
    {
      text: "What is the difference between mean and median?",
      options: [
        "There is no difference",
        "Mean is the middle value, median is the average",
        "Mean is the average, median is the middle value",
        "Both are the same"
      ],
      correctAnswer: 2,
      explanation: "Mean is the arithmetic average of all values, while median is the middle value when data is sorted."
    },
    {
      text: "Which library is commonly used for data visualization in Python?",
      options: ["matplotlib", "numpy", "pandas", "scikit-learn"],
      correctAnswer: 0,
      explanation: "matplotlib is widely used for data visualization in Python."
    },
    {
      text: "What does CSV stand for?",
      options: ["Comma Separated Values", "Columnar Simple Values", "Common Separated Variables", "Comma Simple Variables"],
      correctAnswer: 0,
      explanation: "CSV stands for Comma Separated Values."
    },
    {
      text: "Which method is used to check for missing values in pandas?",
      options: ["isnull()", "isna()", "notnull()", "all of the above"],
      correctAnswer: 3,
      explanation: "All these methods can be used to check for missing values in pandas."
    },
    {
      text: "What is overfitting in machine learning?",
      options: ["Model fits training data too well and fails to generalize", "Model performs well on new data", "Model is too simple", "Model is undertrained"],
      correctAnswer: 0,
      explanation: "Overfitting means the model fits the training data too well and does not generalize to new data."
    },
    {
      text: "Which function is used to read a CSV file in pandas?",
      options: ["read_csv()", "load_csv()", "import_csv()", "open_csv()"],
      correctAnswer: 0,
      explanation: "read_csv() is used to read CSV files in pandas."
    },
    {
      text: "What is the output of 2 ** 3 in Python?",
      options: ["6", "8", "9", "5"],
      correctAnswer: 1,
      explanation: "2 ** 3 is 2 raised to the power 3, which is 8."
    },
    {
      text: "Which algorithm is used for classification problems?",
      options: ["Logistic Regression", "K-Means", "PCA", "Apriori"],
      correctAnswer: 0,
      explanation: "Logistic Regression is commonly used for classification problems."
    },
    {
      text: "What does 'train-test split' mean?",
      options: ["Dividing data into training and testing sets", "Combining datasets", "Normalizing data", "Scaling features"],
      correctAnswer: 0,
      explanation: "Train-test split means dividing data into training and testing sets."
    }
  ],
  "Cybersecurity Basics": [
    {
      text: "What is a DDoS attack?",
      options: [
        "A type of virus",
        "Distributed Denial of Service attack",
        "A firewall breach",
        "A password hack"
      ],
      correctAnswer: 1,
      explanation: "DDoS stands for Distributed Denial of Service, which floods a target with traffic to make it unavailable."
    },
    {
      text: "What is the purpose of HTTPS?",
      options: [
        "To make websites faster",
        "To encrypt data transmission",
        "To block ads",
        "To improve SEO"
      ],
      correctAnswer: 1,
      explanation: "HTTPS encrypts data transmission between the browser and server, providing security and privacy."
    },
    {
      text: "Which of the following is a strong password?",
      options: ["password123", "123456", "Qw!8z$Lp", "abcdef"],
      correctAnswer: 2,
      explanation: "Qw!8z$Lp is a strong password because it uses a mix of characters."
    },
    {
      text: "What does a firewall do?",
      options: ["Blocks unauthorized access", "Stores data", "Encrypts files", "Manages passwords"],
      correctAnswer: 0,
      explanation: "A firewall blocks unauthorized access to or from a private network."
    },
    {
      text: "What is phishing?",
      options: ["A type of malware", "A social engineering attack", "A network protocol", "A firewall rule"],
      correctAnswer: 1,
      explanation: "Phishing is a social engineering attack to steal sensitive information."
    },
    {
      text: "Which protocol is used for secure file transfer?",
      options: ["FTP", "SFTP", "HTTP", "SMTP"],
      correctAnswer: 1,
      explanation: "SFTP (SSH File Transfer Protocol) is used for secure file transfer."
    },
    {
      text: "What is two-factor authentication?",
      options: ["Using two passwords", "Authentication using two methods", "A type of encryption", "A firewall setting"],
      correctAnswer: 1,
      explanation: "Two-factor authentication uses two different methods to verify identity."
    },
    {
      text: "What is malware?",
      options: ["Malicious software", "A type of hardware", "A network protocol", "A password manager"],
      correctAnswer: 0,
      explanation: "Malware is malicious software designed to harm or exploit systems."
    },
    {
      text: "Which of the following is a common cyber threat?",
      options: ["Phishing", "DDoS", "Malware", "All of the above"],
      correctAnswer: 3,
      explanation: "All of the above are common cyber threats."
    },
    {
      text: "What does VPN stand for?",
      options: ["Virtual Private Network", "Very Personal Network", "Verified Protected Network", "Virtual Public Network"],
      correctAnswer: 0,
      explanation: "VPN stands for Virtual Private Network."
    }
  ]
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await CITTest.deleteMany({});
    await CITQuestion.deleteMany({});

    console.log('Cleared existing CIT data');

    // Create tests
    const createdTests = [];
    for (const testData of sampleTests) {
      const test = new CITTest(testData);
      const savedTest = await test.save();
      createdTests.push(savedTest);
      console.log(`Created test: ${savedTest.title}`);
    }

    // Create questions for each test
    for (const test of createdTests) {
      const questions = sampleQuestions[test.title];
      if (questions) {
        const questionDocs = questions.map(q => ({
          testId: test._id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }));

        await CITQuestion.insertMany(questionDocs);
        console.log(`Added ${questions.length} questions to: ${test.title}`);
      }
    }

    console.log('CIT data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding CIT data:', error);
    process.exit(1);
  }
};

seedData(); 