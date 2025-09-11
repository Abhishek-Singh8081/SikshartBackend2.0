import Internship from "../models/internship.model.js";
import mongoose from "mongoose";




const validateInternship = (data) => {
  const errors = [];

  if (!data.title) errors.push("Title is required");
  if (!data.name) errors.push("Name is required");
  if (!data.slug) errors.push("Slug is required");
  if (!data.description) errors.push("Description is required");

  // Optional: check if arrays are actually arrays
  const arrayFields = ["targetAudience", "stacks", "tools", "outcomes", "perks", "requirements", "curriculum"];
  arrayFields.forEach((field) => {
    if (data[field] && !Array.isArray(data[field])) {
      errors.push(`${field} must be an array`);
    }
  });

  return errors;
};



// ✅ CREATE Internship
export const createInternship = async (req, res) => {
  try {
    const errors = validateInternship(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const existing = await Internship.findOne({ slug: req.body.slug });
    if (existing) {
      return res.status(409).json({ message: "Slug already exists" });
    }

    const internship = new Internship(req.body);
    await internship.save();

    res.status(201).json({ message: "Internship created", internship });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// ✅ GET All Internships
export const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find();
    res.status(200).json(internships);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// ✅ GET Internship by ID
export const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const internship = await Internship.findById(id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json(internship);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// ✅ GET Internship by Slug
export const getInternshipBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const internship = await Internship.findOne({ slug });

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json(internship);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// ✅ UPDATE Internship
export const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Fetch the internship first
    const internship = await Internship.findById(id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    // Partial update: Only update fields that exist in req.body
    const updatableFields = [
      "title",
      "name",
      "path",
      "icon",
      "subtitle",
      "gradient",
      "bgGradient",
      "hoverGradient",
      "slug",
      "description",
      "targetAudience",
      "stacks",
      "tools",
      "outcomes",
      "perks",
      "requirements",
      "duration",
      "priceRange",
      "curriculum"
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        internship[field] = req.body[field];
      }
    });

    // Optionally, add your own validation here if needed
    const errors = validateInternship(internship);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    await internship.save();

    res.status(200).json({ message: "Internship updated", internship });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




// ✅ DELETE Internship
export const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const internship = await Internship.findByIdAndDelete(id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json({ message: "Internship deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

