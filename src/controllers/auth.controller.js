import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import Freelancer from "../models/freelancer.model.js";
import Admin from "../models/admin.model.js";
import Company from "../models/company.model.js";
import bcrypt from "bcryptjs";
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
    case "admin":
      return Admin;
    case "company":
      return Company;
    default:
      return null;
  }
};


// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const Model = getModelByRole(role);
    if (!Model) return res.status(400).json({ message: "Invalid role" });

    const existingUser = await Model.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new Model({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    await user.save();

    if (user) {
      const { accessToken, refreshToken } = generateToken(user._id, user.role, res);
      user.refreshToken = refreshToken;
      await user.save();

      res
      .status(201)
      .json({
        message: "Signup successful",
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log({message: err.message});
    
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
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateToken(user._id, user.role, res);
    user.refreshToken = refreshToken;
    await user.save();

    // Debug: Log cookies and user
    console.log('--- LOGIN DEBUG ---');
    console.log('User:', user);
    console.log('Request Headers:', req.headers);
    console.log('Set-Cookie Header:', res.getHeader('Set-Cookie'));
    console.log('-------------------');

    res.json({
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