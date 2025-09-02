import { CITTest, CITRegistration, CITQuestion, CITTestResult } from '../models/cit.model.js';

// Get all CIT tests
const getAllTests = async (req, res) => {
  try {
    const tests = await CITTest.find({ isActive: true })
      .sort({ startDate: 1 })
      .select('-__v');

    res.json({
      success: true,
      tests: tests.map(test => ({
        id: test._id,
        title: test.title,
        description: test.description,
        startDate: test.startDate,
        duration: test.duration,
        maxParticipants: test.maxParticipants,
        registeredParticipants: test.registeredParticipants,
        status: test.status,
        category: test.category,
        difficulty: test.difficulty,
        instructions: test.instructions,
        topics: test.topics
      }))
    });
  } catch (error) {
    console.error('Error fetching CIT tests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests'
    });
  }
};

// Get CIT test by ID
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await CITTest.findById(id).select('-__v');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      test: {
        id: test._id,
        title: test.title,
        description: test.description,
        startDate: test.startDate,
        duration: test.duration,
        maxParticipants: test.maxParticipants,
        registeredParticipants: test.registeredParticipants,
        status: test.status,
        category: test.category,
        difficulty: test.difficulty,
        instructions: test.instructions,
        topics: test.topics
      }
    });
  } catch (error) {
    console.error('Error fetching CIT test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test'
    });
  }
};

// Register for CIT test
const registerForTest = async (req, res) => {
  try {
    const { testId } = req.body;
    const userId = req.user.id;

    // Check if test exists
    const test = await CITTest.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Check if test is full
    if (test.registeredParticipants >= test.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Test is full'
      });
    }

    // Check if user is already registered
    const existingRegistration = await CITRegistration.findOne({
      userId,
      testId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this test'
      });
    }

    // Create registration
    const registration = new CITRegistration({
      userId,
      testId
    });

    await registration.save();

    // Update test participant count
    await CITTest.findByIdAndUpdate(testId, {
      $inc: { registeredParticipants: 1 }
    });

    res.json({
      success: true,
      message: 'Successfully registered for test'
    });
  } catch (error) {
    console.error('Error registering for test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for test'
    });
  }
};

// Unregister from CIT test
const unregisterFromTest = async (req, res) => {
  try {
    const { testId } = req.body;
    const userId = req.user.id;

    // Check if registration exists
    const registration = await CITRegistration.findOne({
      userId,
      testId
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Delete registration
    await CITRegistration.findByIdAndDelete(registration._id);

    // Update test participant count
    await CITTest.findByIdAndUpdate(testId, {
      $inc: { registeredParticipants: -1 }
    });

    res.json({
      success: true,
      message: 'Successfully unregistered from test'
    });
  } catch (error) {
    console.error('Error unregistering from test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister from test'
    });
  }
};

// Get registration status
const getRegistrationStatus = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;

    const registration = await CITRegistration.findOne({
      userId,
      testId
    });

    res.json({
      success: true,
      registered: !!registration
    });
  } catch (error) {
    console.error('Error checking registration status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check registration status'
    });
  }
};

// Get test questions
const getTestQuestions = async (req, res) => {
  try {
    const test = await CITTest.findById(req.params.testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    const questions = await CITQuestion.find({ testId: req.params.testId })
      .select('-correctAnswer -explanation -__v')
      .sort({ createdAt: 1 });
    return res.json({
      success: true,
      questions: questions.map(q => ({
        id: q._id,
        testId: q.testId,
        text: q.text,
        options: q.options
      }))
    });
  } catch (error) {
    console.error('Error fetching test questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test questions'
    });
  }
};

// Submit test answers
const submitTestAnswers = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers, timeTaken, userId } = req.body;

    // Always require userId and registration for Internship Test
    const test = await CITTest.findById(testId);
    if (test && test.title === "Internship Test") {
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required to submit Internship Test answers.'
        });
      }
      // Check if user is registered
      const registration = await CITRegistration.findOne({
        userId,
        testId
      });
      if (!registration) {
        return res.status(403).json({
          success: false,
          message: 'You must be registered to submit answers.'
        });
      }
      // Get questions with correct answers
      const questions = await CITQuestion.find({ testId });
      // Calculate score
      let score = 0;
      const answerDetails = [];
      for (const answer of answers) {
        const question = questions.find(q => q._id.toString() === answer.questionId);
        if (question) {
          const isCorrect = answer.selectedAnswer === question.correctAnswer;
          if (isCorrect) score += question.points;
          answerDetails.push({
            questionId: question._id,
            selectedAnswer: answer.selectedAnswer,
            isCorrect
          });
        }
      }
      // Debug log before saving
      console.log('Saving CITTestResult:', { userId, testId, score, totalQuestions: questions.length, timeTaken, answers: answerDetails });
      // Save test result
      const testResult = new CITTestResult({
        userId,
        testId,
        answers: answerDetails,
        score,
        totalQuestions: questions.length,
        timeTaken
      });
      await testResult.save();
      // Update registration status
      await CITRegistration.findByIdAndUpdate(registration._id, {
        status: 'completed',
        score,
        completedAt: new Date()
      });
      return res.json({
        success: true,
        score,
        totalQuestions: questions.length,
        message: 'Test submitted successfully'
      });
    }

    // For other tests, require authentication and registration as before
    const authUserId = req.user?.id;
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    // Check if user is registered
    const registration = await CITRegistration.findOne({
      userId: authUserId,
      testId
    });
    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'You must be registered to submit answers'
      });
    }
    // Get questions with correct answers
    const questions = await CITQuestion.find({ testId });
    // Calculate score
    let score = 0;
    const answerDetails = [];
    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question) {
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        if (isCorrect) score += question.points;
        answerDetails.push({
          questionId: question._id,
          selectedAnswer: answer.selectedAnswer,
          isCorrect
        });
      }
    }
    // Save test result
    const testResult = new CITTestResult({
      userId: authUserId,
      testId,
      answers: answerDetails,
      score,
      totalQuestions: questions.length,
      timeTaken
    });
    await testResult.save();
    // Update registration status
    await CITRegistration.findByIdAndUpdate(registration._id, {
      status: 'completed',
      score,
      completedAt: new Date()
    });
    // Return only score and total questions, NOT the correct answers
    res.json({
      success: true,
      score,
      totalQuestions: questions.length,
      message: 'Test submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting test answers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit test answers'
    });
  }
};

// Get test results
const getTestResults = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;

    const result = await CITTestResult.findOne({
      userId,
      testId
    }).populate('testId', 'title');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Test result not found'
      });
    }

    res.json({
      success: true,
      result: {
        id: result._id,
        testTitle: result.testId.title,
        score: result.score,
        totalQuestions: result.totalQuestions,
        timeTaken: result.timeTaken,
        submittedAt: result.submittedAt
      }
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test results'
    });
  }
};

// Admin: Create new test
const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      duration,
      maxParticipants,
      category,
      difficulty,
      instructions,
      topics
    } = req.body;

    const test = new CITTest({
      title,
      description,
      startDate,
      duration,
      maxParticipants,
      category,
      difficulty,
      instructions: instructions || [],
      topics: topics || []
    });

    await test.save();

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      test: {
        id: test._id,
        title: test.title,
        description: test.description,
        startDate: test.startDate,
        duration: test.duration,
        maxParticipants: test.maxParticipants,
        category: test.category,
        difficulty: test.difficulty
      }
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test'
    });
  }
};

// Admin: Add questions to test
const addQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const { questions } = req.body;

    // Check if test exists
    const test = await CITTest.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    const questionDocs = questions.map(q => ({
      testId,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      points: q.points || 1
    }));

    await CITQuestion.insertMany(questionDocs);

    res.json({
      success: true,
      message: 'Questions added successfully'
    });
  } catch (error) {
    console.error('Error adding questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add questions'
    });
  }
};

// Get a single CIT question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await CITQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching CIT question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
};

export default {
  getAllTests,
  getTestById,
  registerForTest,
  unregisterFromTest,
  getRegistrationStatus,
  getTestQuestions,
  submitTestAnswers,
  getTestResults,
  createTest,
  addQuestions,
  getQuestionById,
}; 