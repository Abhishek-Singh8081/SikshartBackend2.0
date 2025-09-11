
import Internship from "../models/internship.model.js";
import InternshipRegistration from "../models/internshipregistration.model.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";


export const fileUploadToCloudinary = async (file, folder = "resumes", type = "raw") => {
  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  const maxSize = 4 * 1024 * 1024; // 3 MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error("Only PDF, DOC, or DOCX files are allowed.");
  }

  if (file.size > maxSize) {
    throw new Error("File size should not exceed 3MB.");
  }

  return await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder,
    resource_type: type,
  });
};

export const deleteFromCloudinary = async (public_id) => {
  try {
    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id, { resource_type: "raw" });
    }
  } catch (error) {
    console.error("Failed to delete file from Cloudinary:", error);
  }
};




// ✅ Apply for Internship
export const applyForInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { coverLetter, portfolioLink } = req.body;
    const student = req.user; // Assuming user is authenticated and is a student

    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumeFile = req.files.resume;

    // Upload resume
    const uploadedResume = await fileUploadToCloudinary(resumeFile, "internship_resumes", "raw");

    const registration = new InternshipRegistration({
      student: student._id,
      internship: internshipId,
      resumeUrl: uploadedResume.secure_url,
      coverLetter,
      portfolioLink,
    });

    await registration.save();
    res.status(201).json({ message: "Application submitted successfully", registration });

  } catch (error) {
    console.error("Error in applyForInternship:", error.message);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// ✅ Get All Applications
export const getAllInternshipRegistrations = async (req, res) => {
  try {
    const registrations = await InternshipRegistration.find()
      .populate("student", "name email")
      .populate("internship", "title");

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Get One Application
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await InternshipRegistration.findById(req.params.id)
      .populate("student", "name email")
      .populate("internship", "title");

    if (!registration) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


export const getHackathonRegistrationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const registrations = await HackathonRegistration.find({
      "individual.registered_by.user_id": userId,
    }).populate("hackathon_id");

    res.status(200).json({
      total: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations by user ID:", error);
    res.status(500).json({ message: "Server error while fetching registrations." });
  }
};


// ✅ Get All Applications by Logged-In Student
export const getRegistrationsByStudentId = async (req, res) => {
  try {
    const studentId = req.user._id; // Assuming protectRoute middleware sets this

    const registrations = await InternshipRegistration.find({ student: studentId })
      .populate("internship", "title description duration")
      .populate("student", "name email");

    if (!registrations || registrations.length === 0) {
      return res.status(404).json({ message: "No applications found for this student" });
    }

    res.status(200).json({
      total: registrations.length,
      applications: registrations
    });

  } catch (error) {
    console.error("Error fetching student applications:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Delete Application (and resume from Cloudinary)
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await InternshipRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Application not found" });
    }

    const resumePublicId = registration.resumeUrl?.split("/").pop().split(".")[0];
    await deleteFromCloudinary(`internship_resumes/${resumePublicId}`);

    await InternshipRegistration.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

