import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";

import corsOptions from "./lib/cors.js";

import dashboardRoutes from "./routes/dashboard.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import citRoutes from "./routes/cit.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import internshipsRoutes from "./routes/internships.routes.js";
import citRegistrationsRoutes from "./routes/citregistrations.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";
import instructorsRoutes from "./routes/instructors.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import domainRoutes from "./routes/domain.routes.js";
import blogRoutes from "./routes/blog.routes.js";

const app = express();

dotenv.config();
app.use(cookieParser());

app.use(cors(corsOptions));
// app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cit", citRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/internships", internshipsRoutes);
app.use("/api/citregistrations", citRegistrationsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/instructors", instructorsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/blog", blogRoutes);

app.get("/", (req, res) => {
  console.log("hello");
  res.send("Server is running!");
});

app.get("/ab", (req, res) => {
  res.send("Server is ab!");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Temporary fallback route for citregistrations until the main route is deployed
app.post("/api/citregistrations-fallback", async (req, res) => {
  try {
    console.log("Fallback route: Received registration request:", req.body);
    const { name, email, phone, domain, testId } = req.body;

    if (!name || !email || !phone || !domain) {
      return res
        .status(400)
        .json({ message: "Name, email, phone, and domain are required." });
    }

    // For now, just return success without saving to database
    res.status(201).json({
      message: "Registration successful (fallback route)",
      userId: "temp-user-id-" + Date.now(),
      note: "This is a temporary fallback route",
    });
  } catch (err) {
    console.error("Fallback route error:", err);
    res.status(500).json({ message: "Failed to register", error: err.message });
  }
});

app.get("/api/citregistrations-fallback/ping", (req, res) => {
  res.json({
    message: "Fallback route is working",
    timestamp: new Date().toISOString(),
  });
});

export { app };
