import College from "../models/college.model.js";
import Hackathon from "../models/hackathon.model.js";
import cloudinary from "cloudinary";

// ✅ Utility: Upload to Cloudinary
async function fileUploadToCloudinary(file, folder, type) {
  return await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
    resource_type: type,
  });
}

// ✅ Utility: Delete from Cloudinary
const deleteFromCloudinary = async (public_id) => {
  try {
    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
  }
};

// ✅ Get all hackathons conducted by a college
export const getHackathonsByCollege = async (req, res) => {
  try {
    const collegeId = req.params.collegeId;

    const hackathons = await Hackathon.find({ conducted_by: collegeId });

    res.status(200).json(hackathons);
  } catch (err) {
    console.error("Error fetching hackathons by college:", err);
    res.status(500).json({ message: err.message || "Failed to fetch hackathons" });
  }
};

// ✅ Get a college's profile (excluding sensitive data)
export const getCollegeProfile = async (req, res) => {
  try {
    const collegeId = req.params.collegeId;

    const college = await College.findById(collegeId).select(
      "-password -confirmPassword -otp -otpExpires"
    );

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json(college);
  } catch (err) {
    console.error("Error fetching college profile:", err);
    res.status(500).json({ message: err.message || "Failed to fetch profile" });
  }
};

// ✅ Update college profile (fields + optional image upload)
export const updateCollegeProfile = async (req, res) => {
  try {
    const collegeId = req.params.collegeId;
    const college = await College.findById(collegeId);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // Only allow these fields to be updated
    const updatableFields = [
      "collegeName",
      "phone",
      "city",
      "state",
      "address",
      "pincode",
      "accreditation",
      "establishedYear",
      "studentCount",
      "collegeWebsite",
    ];

    const updates = {};
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // ✅ Handle collegeImage upload (if file is provided)
    if (req.files && req.files.collegeImage) {
      const file = req.files.collegeImage;

      // Delete old image from Cloudinary if exists
      if (college.collegeImage && college.collegeImage.public_id) {
        await deleteFromCloudinary(college.collegeImage.public_id);
      }

      // Upload new image
      const uploadResult = await fileUploadToCloudinary(file, "college_profiles", "image");

      updates.collegeImage = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // Update the document
    const updatedCollege = await College.findByIdAndUpdate(collegeId, updates, {
      new: true,
    }).select("-password -confirmPassword -otp -otpExpires");

    res.status(200).json({
      message: "College profile updated successfully",
      data: updatedCollege,
    });
  } catch (err) {
    console.error("Error updating college profile:", err);
    res.status(500).json({ message: err.message || "Profile update failed" });
  }
};
