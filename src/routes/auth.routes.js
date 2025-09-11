import express from "express";
import { signup, login, refreshToken, logout, getProfile,verifyOtp,reSendOtp,forgotPassword,verifyForgotPasswordOtp,resetPassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyotp",verifyOtp)
router.post("/resendotp",reSendOtp)
router.post("/forgotpassword",forgotPassword)
router.post("/verifyforgotpasswordotp",verifyForgotPasswordOtp)
router.post("/resetpassword",resetPassword)
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

export default router;