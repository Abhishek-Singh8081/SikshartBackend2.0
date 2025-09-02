import express from 'express';
import CITRegistration from '../models/citregistration.model.js';
import mongoose from 'mongoose';

const router = express.Router();

// Simple test endpoint to verify the route is working
router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'CIT registrations route is working', timestamp: new Date().toISOString() });
});

// POST /api/citregistrations
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, domain, testId } = req.body;
    if (!name || !email || !phone || !domain) {
      return res.status(400).json({ message: 'Name, email, phone, and domain are required.' });
    }
    // Generate a userId as a string
    const userId = new mongoose.Types.ObjectId().toString();
    // Explicitly create the registration object
    const registration = new CITRegistration({
      name,
      email,
      phone,
      domain,
      userId,
      ...(testId && { testId })
    });
    console.log('Saving registration:', registration);
    await registration.save();
    res.status(201).json({ message: 'Registration successful', userId: registration.userId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register', error: err.message });
  }
});

// GET /api/citregistrations - Get all registrations (for admin)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all registrations');
    const registrations = await CITRegistration.find().populate('testId', 'title');
    console.log('Found registrations:', registrations.length);
    res.status(200).json({ registrations });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ message: 'Failed to fetch registrations', error: err.message });
  }
});

// Test endpoint to verify the route is working
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'CIT registrations route is working' });
});

export default router; 