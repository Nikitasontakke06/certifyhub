import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js"; // Connects to MongoDB and seeds data
import { User, Course, Job, JobTrendHistory } from "./models.js";
import "./scheduler.js"; // Starts cron schedule runner

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());

// 1. Endpoint: Fetch Courses from MongoDB
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses from database" });
  }
});

// 2. Endpoint: Fetch Jobs from MongoDB sorted by popularity
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ demandScore: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs from database" });
  }
});

// 2b. Endpoint: Fetch Job Trend History from MongoDB
app.get("/api/jobs/:id/history", async (req, res) => {
  try {
    const history = await JobTrendHistory.find({ jobId: req.params.id })
      .sort({ date: 1 })
      .limit(30);
    res.json(history);
  } catch (err) {
    console.error("Error fetching job history:", err);
    res.status(500).json({ error: "Failed to fetch historical trends" });
  }
});

// 3. Endpoint: Auth Signup in MongoDB
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Insert user into MongoDB
    const newUser = new User({ email, password });
    await newUser.save();
    
    res.status(201).json({ email: newUser.email });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Database error during registration." });
  }
});

// 4. Endpoint: Auth Login via MongoDB
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Find matching user in MongoDB
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ email: user.email });
    } else {
      res.status(401).json({ error: "Invalid email or password." });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error during validation." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`CertifyHub API server is running on port ${PORT}`);
});
