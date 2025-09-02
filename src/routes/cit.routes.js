import express from 'express';
import citController from '../controllers/cit.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { adminAuth } from '../middlewares/admin.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/tests', citController.getAllTests);
router.get('/tests/:id', citController.getTestById);
router.get('/tests/:testId/questions', (req, res, next) => {
  console.log('ROUTE HIT: /tests/:testId/questions', req.params.testId);
  next();
});
router.get('/tests/:testId/questions', citController.getTestQuestions);
router.post('/tests/:testId/submit', citController.submitTestAnswers);

// Protected routes (authentication required)
router.use(protectRoute);

// Registration routes
router.post('/register', citController.registerForTest);
router.delete('/register', citController.unregisterFromTest);
router.get('/registration-status/:testId', citController.getRegistrationStatus);

// Test taking routes
router.get('/tests/:testId/results', citController.getTestResults);

// Admin routes (only admin users)
router.post('/admin/tests', protectRoute, citController.createTest);
router.post('/admin/tests/:testId/questions', protectRoute, citController.addQuestions);
router.get('/admin/tests/:testId/questions', adminAuth, citController.getTestQuestions);

// Add this route for fetching a single question by ID
router.get('/questions/:id', citController.getQuestionById);

export default router; 