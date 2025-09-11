import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import Freelancer from "../models/freelancer.model.js";
import Admin from "../models/admin.model.js";
import Company from "../models/company.model.js";
import College from "../models/college.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../../Utils/SendMail.js";
import jwt from "jsonwebtoken";

import { generateToken } from "../lib/token.js";

const getModelByRole = (role) => {
  switch (role) {
    case "student":
      return Student;
    case "teacher":
      return Teacher;
    case "freelancer":
      return Freelancer;
    case "college":
      return College;
    case "company": // ✅ Added
      return Company;
    default:
      return null;
  }
};

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    if (!email || !otp || !role) {
      return res.status(400).json({ success: false, message: "Email, OTP, and role are required" });
    }

    const Model = getModelByRole(role);
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const reSendOtp = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ success: false, message: "Email and role are required" });
    }

    const Model = getModelByRole(role);
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await user.save();

    await sendEmail(email, "Resend OTP", `Your OTP is ${otp}. It expires in 5 minutes.`);

    return res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ success: false, message: "Email and role are required" });
    }

    const Model = getModelByRole(role);
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendEmail(
      email,
      "Reset Password OTP",
      `Your OTP is ${otp}. It will expire in 5 minutes.`
    );

    return res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword, role } = req.body;

    console.log(req.body);

    if (!email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const Model = getModelByRole(role);
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email not verified. Please verify your email first.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // ✅ No need to touch confirmPassword
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    if (!email || !otp || !role) {
      return res.status(400).json({ success: false, message: "Email, OTP and role are required" });
    }

    const Model = getModelByRole(role);
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const signup = async (req, res) => {
  try {
    const { role } = req.body;

    const Model = getModelByRole(role);
    if (!Model) return res.status(400).json({ message: "Invalid role" });

    const { email, password, confirmPassword } = req.body;

    // Check existing user
    const existingUser = await Model.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and expiry (10 minutes)
    const otp = generateOtp(); // You must define this function
    const otpExpires = Date.now() + 10 * 60 * 1000;

    // Role-specific field setup
    let newUserData;

    switch (role) {
      case "student":
        newUserData = {
          name: req.body.name,
          email,
          phone: req.body.phone,
          city: req.body.city,
          age: req.body.age,
          collegeName: req.body.collegeName,
          courseName: req.body.courseName,
          yearOfStudy: req.body.yearOfStudy,
          password: hashedPassword,
          confirmPassword: hashedPassword,
          role,
          isEmailVerified: false,
          otp,
          otpExpires,
        };
        break;

      case "teacher":
        newUserData = {
          name: req.body.name,
          email,
          phone: req.body.phone,
          city: req.body.city,
          password: hashedPassword,
          confirmPassword: hashedPassword,
          description: req.body.description,
          resumeUrl: req.body.resumeUrl,
          profileImage: req.body.profileImage,
          yearsOfExperience: req.body.yearsOfExperience,
          currentInstitution: req.body.currentInstitution || "",
          previousInstitution: req.body.previousInstitution || "",
          teachingCourses: req.body.teachingCourses || [],
          subjects: req.body.subjects || [],
          qualifications: req.body.qualifications || [],
          role,
          isEmailVerified: false,
          otp,
          otpExpires,
        };
        break;

      case "freelancer":
        newUserData = {
          name: req.body.name,
          email,
          phone: req.body.phone,
          city: req.body.city,
          password: hashedPassword,
          confirmPassword: hashedPassword,
          resumeUrl: req.body.resumeUrl || "",
          portfolioUrl: req.body.portfolioUrl || "",
          profileImage: req.body.profileImage,
          yearsOfExperience: req.body.yearsOfExperience,
          skills: req.body.skills || [],
          role,
          isEmailVerified: false,
          otp,
          otpExpires,
        };
        break;

case "college":
  newUserData = {
    collegeName: req.body.collegeName,
    email,
    phone: req.body.phone,
    city: req.body.city,
    state: req.body.state, // ✅ Add this line
    address: req.body.address,
    pincode: req.body.pincode,
    accreditation: req.body.accreditation || "",
    establishedYear: req.body.establishedYear,
    studentCount: req.body.studentCount || 0,
    collegeWebsite: req.body.collegeWebsite || "",
    password: hashedPassword,
    confirmPassword: hashedPassword,
    role,
    isEmailVerified: false,
    isActive: true,
    otp,
    otpExpires,
  };
  break;


      case "company": // ✅ Newly Added Case
        newUserData = {
          name: req.body.name,
          email,
          phone: req.body.phone,
          password: hashedPassword,
          confirmPassword: hashedPassword,
          role,
          image: req.body.image || { url: "", public_id: "" },
          industry: req.body.industry || "",
          companySize: req.body.companySize || "1-10",
          website: req.body.website || "",
          address: req.body.address || "",
          description: req.body.description || "",
          isVerified: false,
          isActive: true,
          otp,
          otpExpires,
        };
        break;

      default:
        return res.status(400).json({ message: "Role not supported." });
    }

    const user = new Model(newUserData);
    await user.save();

    // Send OTP email
    await sendEmail(
      email,
      "Your OTP Verification Code",
      `Your OTP code is ${otp}. It will expire in 10 minutes.`
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateToken(user._id, user.role, res);
    user.refreshToken = refreshToken;
    await user.save();

    const responseData = {
      message: "Signup successful. Please verify your email using the OTP sent.",
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accessToken,
      refreshToken,
    };

    res.status(201).json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Signup failed" });
  }
};



const findUserByEmail = async (email) => {
  const models = [Student, Teacher, Freelancer, Admin, Company];
  for (const Model of models) {
    const user = await Model.findOne({ email });
    if (user) return { user, Model };
  }
  return { user: null, Model: null };
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user } = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Email not verified. Please verify your email using the OTP sent to your email address.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateToken(user._id, user.role, res);
    user.refreshToken = refreshToken;
    await user.save();

    // Set tokens in HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send tokens in response body as well
    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





const findUserByRefreshToken = async (refreshToken) => {
  const models = [Student, Teacher, Freelancer, Admin, Company];
  for (const Model of models) {
    const user = await Model.findOne({ refreshToken });
    if (user) return { user, Model };
  }
  return { user: null, Model: null };
};

// logout
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const { user, Model } = await findUserByRefreshToken(refreshToken);
      if (user && Model) {
        user.refreshToken = "";
        await user.save();
      }
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// refresh token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Refresh Token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Refresh Token" });
    }

    const { user } = await findUserByRefreshToken(refreshToken);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      user._id,
      user.role,
      res
    );
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.log("Error in refreshToken:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { _id, name, email, role, phone, profileImage } = req.user;
    res.json({ user: { id: _id, name, email, role, phone, profileImage } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Find or create student by email and phone (no password required)
export const findOrCreateStudent = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email || !phone) {
      return res.status(400).json({ message: 'Email and phone are required' });
    }
    let student = await Student.findOne({ email });
    if (!student) {
      // Create a new student with a random password (not used for login)
      const randomPassword = Math.random().toString(36).slice(-8);
      student = new Student({
        name: email.split('@')[0], // Placeholder name
        email,
        phone,
        password: randomPassword,
        role: 'student',
      });
      await student.save();
    }
    return res.json({ userId: student._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to find or create student', error: err.message });
  }
};