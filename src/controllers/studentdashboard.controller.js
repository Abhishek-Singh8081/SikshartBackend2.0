import cloudinary from "cloudinary";
import Student from "../models/student.model.js";

async function fileUploadToCloudinary(file, folder, type) {
  return await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
    resource_type: type, 
  });
}

const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
  }
};

// ✅ Get All Students,
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("enrolledProgram").select("-password -refreshToken");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Student By ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("enrolledProgram");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Student only chaneged by student 
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Handle profile image replacement
    if (req.files?.profileImage) {
      if (student.profileImage?.public_id) {
        await deleteFromCloudinary(student.profileImage.public_id);
      }
      const uploadedImage = await fileUploadToCloudinary(req.files.profileImage, "student_profiles");
      student.profileImage = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    // Allow partial updates
    const updatableFields = [
      "name", "email", "phone", "city", "age", "collegeName", "courseName",
      "yearOfStudy", "resumeUrl", "isActive", "isEmailVerified"
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    await student.save();
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.profileImage?.public_id) {
      await deleteFromCloudinary(student.profileImage.public_id);
    }

    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


