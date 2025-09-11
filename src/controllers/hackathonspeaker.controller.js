import cloudinary from "cloudinary";
import HackathonSpeaker from "../models/hackathonspeaker.model.js";

// Cloudinary Upload Helper
async function fileUploadToCloudinary(file, folder = "hackathon_speakers", type = "image") {
  return await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder,
    resource_type: type,
  });
}

// Cloudinary Delete Helper
const deleteFromCloudinary = async (public_id) => {
  try {
    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
  }
};

// Create speaker
export const createSpeaker = async (req, res) => {
  try {
    const { name, profession } = req.body;

    if (!name || !profession) {
      return res.status(400).json({ message: "Name and profession are required." });
    }

    let profileImage = {
      url: "",
      public_id: "",
    };

    if (req.files && req.files.profileImage) {
      const result = await fileUploadToCloudinary(req.files.profileImage, "hackathon_speakers");
      profileImage.url = result.secure_url;
      profileImage.public_id = result.public_id;
    }

    const newSpeaker = await HackathonSpeaker.create({
      name,
      profession,
      profileImage,
    });

    res.status(201).json({
      message: "Speaker created successfully.",
      data: newSpeaker,
    });

  } catch (error) {
    console.error("Error creating speaker:", error);
    res.status(500).json({ message: "Server error while creating speaker." });
  }
};


// Get all speakers
export const getAllSpeakers = async (req, res) => {
  try {
    const speakers = await HackathonSpeaker.find().sort({ createdAt: -1 });
    res.status(200).json(speakers);
  } catch (error) {
    console.error("Error fetching speakers:", error);
    res.status(500).json({ message: "Server error while fetching speakers." });
  }
};

// Get single speaker by ID
export const getSpeakerById = async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = await HackathonSpeaker.findById(id);

    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found." });
    }

    res.status(200).json(speaker);
  } catch (error) {
    console.error("Error fetching speaker:", error);
    res.status(500).json({ message: "Server error while fetching speaker." });
  }
};

// Update speaker (supports partial updates + image update)
export const updateSpeaker = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSpeaker = await HackathonSpeaker.findById(id);
    if (!existingSpeaker) {
      return res.status(404).json({ message: "Speaker not found." });
    }

    const updateData = { ...req.body };

    // Handle profileImage update
    if (req.files && req.files.profileImage) {
      // Delete old image from Cloudinary if exists
      if (existingSpeaker.profileImage?.public_id) {
        await deleteFromCloudinary(existingSpeaker.profileImage.public_id);
      }

      // Upload new image
      const result = await fileUploadToCloudinary(req.files.profileImage, "hackathon_speakers");
      updateData.profileImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Update fields in existingSpeaker
    Object.keys(updateData).forEach((key) => {
      existingSpeaker[key] = updateData[key];
    });

    await existingSpeaker.save();

    res.status(200).json({
      message: "Speaker updated successfully.",
      data: existingSpeaker,
    });

  } catch (error) {
    console.error("Error updating speaker:", error);
    res.status(500).json({ message: "Server error while updating speaker." });
  }
};

// Delete speaker and their image
export const deleteSpeaker = async (req, res) => {
  try {
    const { id } = req.params;

    const speaker = await HackathonSpeaker.findById(id);
    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found." });
    }

    // Delete image from Cloudinary
    if (speaker.profileImage?.public_id) {
      await deleteFromCloudinary(speaker.profileImage.public_id);
    }

    await speaker.deleteOne();

    res.status(200).json({ message: "Speaker deleted successfully." });

  } catch (error) {
    console.error("Error deleting speaker:", error);
    res.status(500).json({ message: "Server error while deleting speaker." });
  }
};
