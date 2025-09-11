// controllers/calltoaction.controller.js
import CallToAction from "../models/calltoaction.model.js";

// 📥 Create CTA
export const createCTA = async (req, res) => {
  try {
    const { title, subtitles } = req.body;

    if (subtitles && subtitles.length > 6) {
      return res.status(400).json({ error: "Maximum 6 subtitles are allowed." });
    }

    const newCTA = new CallToAction({ title, subtitles });
    await newCTA.save();
    res.status(201).json(newCTA);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 📤 Get all CTA blocks
export const getAllCTAs = async (req, res) => {
  try {
    const ctas = await CallToAction.find();
    res.json(ctas);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🖊️ Update a CTA by ID
export const updateCTA = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitles } = req.body;

    if (subtitles && subtitles.length > 6) {
      return res.status(400).json({ error: "Maximum 6 subtitles are allowed." });
    }

    const updated = await CallToAction.findByIdAndUpdate(
      id,
      { title, subtitles },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "CTA not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🗑️ Delete a CTA
export const deleteCTA = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CallToAction.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "CTA not found" });
    }

    res.json({ message: "CTA deleted", cta: deleted });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// Update specific subtitle
export const updateSubtitle = async (req, res) => {
  try {
    const { ctaId, subtitleId } = req.params;
    const { text } = req.body;

    const cta = await CallToAction.findOneAndUpdate(
      { _id: ctaId, "subtitles._id": subtitleId },
      { $set: { "subtitles.$.text": text } },
      { new: true }
    );

    if (!cta) {
      return res.status(404).json({ error: "CTA or subtitle not found" });
    }

    res.json(cta);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Delete specific subtitle
export const deleteSubtitle = async (req, res) => {
  try {
    const { ctaId, subtitleId } = req.params;

    const cta = await CallToAction.findById(ctaId);
    if (!cta) return res.status(404).json({ error: "CTA not found" });

    cta.subtitles = cta.subtitles.filter(sub => sub._id.toString() !== subtitleId);

    if (cta.subtitles.length > 6) {
      return res.status(400).json({ error: "Cannot exceed 6 subtitles" });
    }

    await cta.save();
    res.json({ message: "Subtitle removed", cta });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
