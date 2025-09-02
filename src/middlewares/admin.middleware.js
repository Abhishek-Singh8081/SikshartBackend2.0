import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");

    if (!admin) {
      return res.status(401).json({ error: "Invalid Access Token" });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin role required." });
    }

    req.user = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token" });
  }
}; 