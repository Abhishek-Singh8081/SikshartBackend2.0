import express from 'express';
import Domain from '../models/domain.model.js';

const router = express.Router();

// Get all domains
router.get('/', async (req, res) => {
  try {
    const domains = await Domain.find().sort({ name: 1 });
    res.json(domains);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch domains' });
  }
});

// Create a new domain
router.post('/', async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) return res.status(400).json({ message: 'Name and slug are required' });
    const domain = new Domain({ name, slug });
    await domain.save();
    res.status(201).json(domain);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create domain', error: err.message });
  }
});

// Update a domain
router.put('/:id', async (req, res) => {
  try {
    const { name, slug } = req.body;
    const domain = await Domain.findByIdAndUpdate(req.params.id, { name, slug }, { new: true });
    if (!domain) return res.status(404).json({ message: 'Domain not found' });
    res.json(domain);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update domain', error: err.message });
  }
});

// Delete a domain
router.delete('/:id', async (req, res) => {
  try {
    const domain = await Domain.findByIdAndDelete(req.params.id);
    if (!domain) return res.status(404).json({ message: 'Domain not found' });
    res.json({ message: 'Domain deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete domain', error: err.message });
  }
});

export default router; 