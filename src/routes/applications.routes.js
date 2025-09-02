import express from 'express';
import Application from '../models/application.model.js';

const router = express.Router();

// POST /api/applications
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, domain } = req.body;
    if (!name || !email || !phone || !domain) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const application = new Application({ name, email, phone, domain });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit application', error: err.message });
  }
});

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
});

// Get a single application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch application', error: err.message });
  }
});

// Update an application by ID
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application updated successfully', application });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update application', error: err.message });
  }
});

// Delete an application by ID
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete application', error: err.message });
  }
});

export default router; 