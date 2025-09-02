import express from 'express';
import Internship from '../models/internship.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch internships' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const internship = await Internship.findOne({ slug: req.params.slug });
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch internship' });
  }
});

export default router; 