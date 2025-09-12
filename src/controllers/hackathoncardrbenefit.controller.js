// controllers/hackathonCardsBenefits.controller.js
import Card from "../models/hackathoncardsbenefits.model.js";

// 📥 Create new card
export const createCard = async (req, res) => {
  try {
    const totalCards = await Card.countDocuments();
    if (totalCards >= 5) {
      return res.status(400).json({ error: "Maximum 5 cards are allowed." });
    }

    const { title, description, benefit } = req.body;
    console.log(req.body)

    // Check for duplicate title (optional – remove this if not needed)
    const existingCard = await Card.findOne({ title });
    if (existingCard) {
      return res.status(400).json({ error: "Card with this title already exists." });
    }

    const newCard = new Card({ title, description, benefit });
    await newCard.save();

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 📤 Get all cards
export const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ _id: 1 }); // Sort by creation order
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🗑️ Delete a card by ID
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Card.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json({ message: "Card deleted successfully", card: deleted });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🔄 Update a card by ID
export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, benefit } = req.body;

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { title, description, benefit },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
