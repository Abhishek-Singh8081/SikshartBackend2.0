import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import corsOptions from "./lib/cors.js";

import authRoutes from "./routes/auth.routes.js";
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
import publicRoutes from "./routes/public.routes.js";

const app = express();

dotenv.config();

// Parse cookies once
app.use(cookieParser());

// Enable file uploads with temp directory compatible with Windows
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/", // relative path; will be created if missing (createParentPath: true)
    createParentPath: true,
    parseNested: true, // <-- add this
  })
);

// Enable CORS with your config
app.use(cors(corsOptions));

// Parse JSON and URL encoded bodies AFTER fileUpload middleware (multipart/form-data reqs are handled by fileUpload)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware to see incoming requests (after parsing so req.body and req.files are available)
app.use((req, res, next) => {
  console.log("--- Incoming request ---");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);
  next();
});

// Routes
app.use("/api/public", publicRoutes);
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

// Simple test routes
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

// Temporary fallback route for citregistrations
app.post("/api/citregistrations-fallback", async (req, res) => {
  try {
    console.log("Fallback route: Received registration request:", req.body);
    const { name, email, phone, domain, testId } = req.body;

    if (!name || !email || !phone || !domain) {
      return res
        .status(400)
        .json({ message: "Name, email, phone, and domain are required." });
    }

    // Just return success for now
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
