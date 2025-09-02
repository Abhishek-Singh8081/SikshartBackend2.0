import express from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/summary", protectRoute, getDashboardSummary);

export default router; 