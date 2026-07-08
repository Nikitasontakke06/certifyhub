import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js"; // Connects to MongoDB and seeds data
import { User, Course, Job, JobTrendHistory, UserPreference, ComparisonHistory } from "./models.js";
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

// --- Profile & Preferences Endpoints ---

// 5. Get User Preferences
app.get("/api/preferences", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    let pref = await UserPreference.findOne({ userEmail: email.toLowerCase() });
    if (!pref) {
      // Create default preferences
      pref = new UserPreference({ userEmail: email.toLowerCase() });
      await pref.save();
    }
    res.json(pref);
  } catch (err) {
    console.error("Error getting preferences:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// 6. Update User Preferences
app.post("/api/preferences", async (req, res) => {
  const { email, preferredDomains, skillLevel, budgetLimit, preferredPlatforms, emailNotifications, themePreference } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    const pref = await UserPreference.findOneAndUpdate(
      { userEmail: email.toLowerCase() },
      {
        preferredDomains,
        skillLevel,
        budgetLimit,
        preferredPlatforms,
        emailNotifications,
        themePreference
      },
      { new: true, upsert: true }
    );
    res.json(pref);
  } catch (err) {
    console.error("Error saving preferences:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// 7. Get Recommendations based on Preferences
app.get("/api/recommendations", async (req, res) => {
  const { email } = req.query;
  try {
    let domains = [];
    let level = "Beginner";
    let budget = 50000; // default high budget
    let platforms = [];
    if (email) {
      const pref = await UserPreference.findOne({ userEmail: email.toLowerCase() });
      if (pref) {
        domains = pref.preferredDomains || [];
        level = pref.skillLevel || "Beginner";
        budget = pref.budgetLimit !== undefined ? pref.budgetLimit : 50000;
        platforms = pref.preferredPlatforms || [];
      }
    }
    
    // Construct search query
    const query = {};
    if (domains.length > 0) {
      query.category = { $in: domains };
    }
    if (platforms.length > 0) {
      query.provider = { $in: platforms };
    }
    // If budget limit is set
    query.price = { $lte: budget };
    
    // level matching
    if (level && level !== "All Levels") {
      query.level = level;
    }
    
    let recommended = await Course.find(query).sort({ rating: -1 }).limit(4);
    
    // Fallback: if no courses match the tight criteria, loosen them up (ignore level/platform)
    if (recommended.length === 0) {
      const looseQuery = {};
      if (domains.length > 0) looseQuery.category = { $in: domains };
      looseQuery.price = { $lte: budget };
      recommended = await Course.find(looseQuery).sort({ rating: -1 }).limit(4);
    }
    
    // Fallback 2: if still empty, return top rated courses overall
    if (recommended.length === 0) {
      recommended = await Course.find({}).sort({ rating: -1 }).limit(4);
    }
    
    res.json(recommended);
  } catch (err) {
    console.error("Error getting recommendations:", err);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// 8. Fetch Comparison History
app.get("/api/comparison-history", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    const history = await ComparisonHistory.find({ userEmail: email.toLowerCase() })
      .populate("courses")
      .sort({ date: -1 })
      .limit(10);
    res.json(history);
  } catch (err) {
    console.error("Error fetching comparison history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 9. Save Comparison History
app.post("/api/comparison-history", async (req, res) => {
  const { email, courseIds } = req.body;
  if (!email || !courseIds || !Array.isArray(courseIds) || courseIds.length < 2) {
    return res.status(400).json({ error: "Invalid parameters" });
  }
  try {
    // Avoid logging the exact same comparison multiple times consecutively within 5 mins
    const latest = await ComparisonHistory.findOne({ userEmail: email.toLowerCase() })
      .sort({ date: -1 });
      
    if (latest) {
      const latestIds = latest.courses.map(c => c.toString());
      const isSame = latestIds.length === courseIds.length && 
                     latestIds.every(id => courseIds.includes(id));
      if (isSame) {
        latest.date = new Date();
        await latest.save();
        return res.json(latest);
      }
    }
    
    const newLog = new ComparisonHistory({
      userEmail: email.toLowerCase(),
      courses: courseIds
    });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    console.error("Error storing comparison history:", err);
    res.status(500).json({ error: "Failed to store history" });
  }
});

// 10. Change Password
app.post("/api/auth/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== currentPassword) {
      return res.status(401).json({ error: "Invalid current password" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`CertifyHub API server is running on port ${PORT}`);
});
