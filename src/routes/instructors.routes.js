import express from 'express';
import Instructor from '../models/instructor.model.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public: Get all instructors
router.get('/', async (req, res) => {
  try {
    const instructorsRaw = await Instructor.find().lean();
    const instructors = instructorsRaw.map(t => ({
      id: t._id,
      name: t.name,
      title: t.title,
      avatar: t.avatar,
      rating: t.rating,
      students: t.students,
      courses: t.courses,
      experience: t.experience,
      category: t.category,
      location: t.location,
      bio: t.bio,
      specialties: t.specialties,
      achievements: t.achievements,
      email: t.email,
      phone: t.phone,
      social: t.social,
      courseHighlights: t.courseHighlights,
    }));
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
});

// Admin: Create instructor
router.post('/admin', protectRoute, async (req, res) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json(instructor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create instructor' });
  }
});

// Admin: Update instructor
router.put('/admin/:id', protectRoute, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update instructor' });
  }
});

// Admin: Delete instructor
router.delete('/admin/:id', protectRoute, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json({ message: 'Instructor deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete instructor' });
  }
});

export default router; 