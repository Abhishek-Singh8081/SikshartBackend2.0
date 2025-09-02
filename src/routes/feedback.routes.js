import express from 'express';
import Feedback from '../models/feedback.model.js';

const router = express.Router();

const DUMMY_IMAGE = 'https://ui-avatars.com/api/?name=User&background=random';

// POST /api/feedback
router.post('/', async (req, res) => {
  try {
    let { name, image, message, rating, consent, domain } = req.body;
    if (!name || !message || !rating || !consent || !domain) {
      return res.status(400).json({ error: 'All required fields must be filled and consent must be given.' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }
    if (!image) {
      image = DUMMY_IMAGE;
    }
    const feedbackDoc = new Feedback({ name, image, message, rating, consent, domain });
    await feedbackDoc.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: feedbackDoc });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/feedback
router.get('/', async (req, res) => {
  try {
    const feedbackList = await Feedback.find({ consent: true }).sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all feedback (admin, including non-consented)
router.get('/all', async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a feedback by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'feedback not found' });
    }
    res.json({ message: 'feedback updated successfully', feedback: updatedFeedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a feedback by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!deletedFeedback) {
      return res.status(404).json({ error: 'feedback not found' });
    }
    res.json({ message: 'feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 