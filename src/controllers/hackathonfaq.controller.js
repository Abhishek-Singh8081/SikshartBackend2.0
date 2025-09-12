// controllers/faq.controller.js
import FAQ from "../models/hackathonfaq.model.js";

// 📥 Create a new FAQ
export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const existingFAQ = await FAQ.findOne({ question });
    if (existingFAQ) {
      return res.status(400).json({ error: "This question already exists." });
    }

    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 📤 Get all FAQs
export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ _id: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🗑️ Delete FAQ by ID
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FAQ.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.json({ message: "FAQ deleted successfully", faq: deleted });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🔄 Update FAQ by ID
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true, runValidators: true }
    );

    if (!updatedFAQ) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.json(updatedFAQ);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
