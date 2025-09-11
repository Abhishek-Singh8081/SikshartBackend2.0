import jwt from "jsonwebtoken";
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import Freelancer from "../models/freelancer.model.js";
import Admin from "../models/admin.model.js";
import Company from "../models/company.model.js";

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

export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;

    // Also check Authorization header for Bearer token
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }
// console.log("my token",token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    const role = decoded.role;
    

    if (!decoded || !role) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const Model = getModelByRole(role);
    console.log(Model);
    if (!Model) {
      return res.status(401).json({ message: "Unauthorized - Invalid Role" });
    }
    const user = await Model.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Token Expired" });
    }

    console.log("Error in protectRoute:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const isAdmin = (req, res, next) => {
  console.log(req.user)
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Forbidden - Student access required" });
  }
  next();
};

export const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Forbidden - Teacher access required" });
  }
  next();
};

export const isFreelancer = (req, res, next) => {
  if (req.user.role !== "freelancer") {
    return res.status(403).json({ message: "Forbidden - Freelancer access required" });
  }
  next();
};

export const isCompany = (req, res, next) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Forbidden - Company access required" });
  }
  next();
};
export const iscollege = (req, res, next) => {
  if (req.user.role !== "college") {
    return res.status(403).json({ message: "Forbidden - Company access required" });
  }
  next();
};

export const isStudentOrFreelancer = (req, res, next) => {
  console.log(req.user.role)
  if (req.user.role !== "student" &&  req.user.role !== "freelancer") {
    return res.status(403).json({ message: "Access denied - Only students or freelancers allowed" });
  }
  next();
};
