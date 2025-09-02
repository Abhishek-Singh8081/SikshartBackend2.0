import express from 'express';
import Contact from '../models/contact.model.js';

const router = express.Router();

// Create a new contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }
    const contact = new Contact({ firstName, lastName, email, phone, message });
    await contact.save();
    res.status(201).json({ message: 'Contact submitted successfully', contact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a contact by ID
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact updated successfully', contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;