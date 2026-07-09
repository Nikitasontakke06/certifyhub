import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js"; // Connects to MongoDB and seeds data
import { User, Course, Job, JobTrendHistory, UserPreference, ComparisonHistory, Institute, InstituteReview, UserInquiry, SavedInstitute, LoginHistory } from "./models.js";
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
    
    // Save login history log
    const loginLog = new LoginHistory({
      userEmail: newUser.email.toLowerCase(),
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || ""
    });
    await loginLog.save();

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
      // Save login history log
      const loginLog = new LoginHistory({
        userEmail: user.email.toLowerCase(),
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || ""
      });
      await loginLog.save();

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

// --- Offline Classes Endpoints ---

// 1. Get all institutes with filtering
app.get("/api/institutes", async (req, res) => {
  const { search, category, location, rating, weekend, feeMax, placement } = req.query;
  try {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "courses.title": { $regex: search, $options: "i" } }
      ];
    }

    if (category && category !== "all") {
      query.categories = category;
    }

    if (location) {
      query.$or = [
        { city: { $regex: location, $options: "i" } },
        { state: { $regex: location, $options: "i" } },
        { address: { $regex: location, $options: "i" } }
      ];
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    if (weekend === "true") {
      query["courses.batchTimings"] = { $regex: /(weekend|sat|sun)/i };
    }

    if (feeMax) {
      query["courses.fees"] = { $lte: parseInt(feeMax) };
    }

    if (placement === "true") {
      query.$or = [
        { placementRecord: { $regex: /placements?/i } },
        { "courses.placementAssistance": true }
      ];
    }

    const institutes = await Institute.find(query);
    res.json(institutes);
  } catch (err) {
    console.error("Error fetching institutes:", err);
    res.status(500).json({ error: "Failed to fetch institutes" });
  }
});

// 2. Get single institute by ID
app.get("/api/institutes/:id", async (req, res) => {
  try {
    const inst = await Institute.findOne({ id: req.params.id });
    if (!inst) return res.status(404).json({ error: "Institute not found" });
    res.json(inst);
  } catch (err) {
    console.error("Error fetching institute details:", err);
    res.status(500).json({ error: "Failed to fetch institute details" });
  }
});

// 3. Get reviews for an institute
app.get("/api/institutes/:id/reviews", async (req, res) => {
  try {
    const reviews = await InstituteReview.find({ instituteId: req.params.id }).sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// 4. Submit review for an institute (and recalculate average rating)
app.post("/api/institutes/:id/reviews", async (req, res) => {
  const { userEmail, userName, rating, text, pros, cons } = req.body;
  const instituteId = req.params.id;

  if (!userEmail || !userName || !rating || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newReview = new InstituteReview({
      instituteId,
      userEmail: userEmail.toLowerCase(),
      userName,
      rating: parseFloat(rating),
      text,
      pros: Array.isArray(pros) ? pros : [],
      cons: Array.isArray(cons) ? cons : []
    });
    await newReview.save();

    // Recalculate average rating
    const allReviews = await InstituteReview.find({ instituteId });
    const count = allReviews.length;
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / count;

    await Institute.findOneAndUpdate(
      { id: instituteId },
      { rating: parseFloat(avg.toFixed(1)), reviewsCount: count }
    );

    res.status(201).json(newReview);
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// 5. Like a review (toggle helpful count)
app.post("/api/institutes/:id/reviews/:reviewId/like", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    const review = await InstituteReview.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const lowerEmail = email.toLowerCase();
    const index = review.likedBy.indexOf(lowerEmail);

    if (index === -1) {
      review.likedBy.push(lowerEmail);
      review.likes += 1;
    } else {
      review.likedBy.splice(index, 1);
      review.likes -= 1;
    }

    await review.save();
    res.json(review);
  } catch (err) {
    console.error("Error liking review:", err);
    res.status(500).json({ error: "Failed to like review" });
  }
});

// 6. Submit user inquiry / callback / demo bookings
app.post("/api/inquiries", async (req, res) => {
  const { userEmail, instituteId, instituteName, courseId, courseName, type, message } = req.body;
  if (!userEmail || !instituteId || !instituteName || !type) {
    return res.status(400).json({ error: "Missing required inquiry fields" });
  }
  try {
    const inquiry = new UserInquiry({
      userEmail: userEmail.toLowerCase(),
      instituteId,
      instituteName,
      courseId: courseId || "",
      courseName: courseName || "",
      type,
      message: message || ""
    });
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (err) {
    console.error("Error saving inquiry:", err);
    res.status(500).json({ error: "Failed to save inquiry" });
  }
});

// 7. Get user inquiries (for Profile or Admin view)
app.get("/api/inquiries", async (req, res) => {
  const { email } = req.query;
  try {
    const query = {};
    if (email) {
      query.userEmail = email.toLowerCase();
    }
    const inquiries = await UserInquiry.find(query).sort({ date: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

// 8. Update inquiry status (admin control)
app.post("/api/inquiries/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const inquiry = await UserInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });
    res.json(inquiry);
  } catch (err) {
    console.error("Error updating inquiry status:", err);
    res.status(500).json({ error: "Failed to update inquiry status" });
  }
});

// 9. Get saved offline institutes/courses bookmarks
app.get("/api/saved-institutes", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    let saved = await SavedInstitute.findOne({ userEmail: email.toLowerCase() });
    if (!saved) {
      saved = new SavedInstitute({ userEmail: email.toLowerCase() });
      await saved.save();
    }
    res.json(saved);
  } catch (err) {
    console.error("Error fetching saved offline classes:", err);
    res.status(500).json({ error: "Failed to fetch saved items" });
  }
});

// 10. Toggle bookmark (saved institutes or saved courses)
app.post("/api/saved-institutes/toggle", async (req, res) => {
  const { email, instituteId, courseId } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    let saved = await SavedInstitute.findOne({ userEmail: email.toLowerCase() });
    if (!saved) {
      saved = new SavedInstitute({ userEmail: email.toLowerCase() });
    }

    if (instituteId) {
      const index = saved.savedInstitutes.indexOf(instituteId);
      if (index === -1) {
        saved.savedInstitutes.push(instituteId);
      } else {
        saved.savedInstitutes.splice(index, 1);
      }
    }

    if (courseId) {
      const index = saved.savedInstituteCourses.indexOf(courseId);
      if (index === -1) {
        saved.savedInstituteCourses.push(courseId);
      } else {
        saved.savedInstituteCourses.splice(index, 1);
      }
    }

    await saved.save();
    res.json(saved);
  } catch (err) {
    console.error("Error toggling offline class bookmark:", err);
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
});

// 11. Admin Add or Edit Institute
app.post("/api/admin/institutes", async (req, res) => {
  const { id, name, logo, coverImage, description, establishedYear, categories, phone, email, website, whatsapp, socials, address, landmarks, city, state, coordinates, infrastructure, practicalLabs, placementRecord, courses } = req.body;
  if (!name || !logo || !coverImage || !description || !phone || !email || !address || !city || !state) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const updateObj = {
      name,
      logo,
      coverImage,
      description,
      establishedYear: parseInt(establishedYear) || 2026,
      categories: Array.isArray(categories) ? categories : [],
      phone,
      email,
      website: website || "",
      whatsapp: whatsapp || "",
      socials: socials || { facebook: "", twitter: "", linkedin: "" },
      address,
      landmarks: Array.isArray(landmarks) ? landmarks : [],
      city,
      state,
      coordinates: coordinates || { lat: 18.5204, lng: 73.8567 }, // default Pune
      infrastructure: Array.isArray(infrastructure) ? infrastructure : [],
      practicalLabs: practicalLabs !== undefined ? practicalLabs : true,
      placementRecord: placementRecord || "",
      courses: Array.isArray(courses) ? courses : []
    };

    let institute;
    if (id) {
      // Edit
      institute = await Institute.findOneAndUpdate(
        { id },
        updateObj,
        { new: true }
      );
    } else {
      // Create new
      const generatedId = "inst-" + Date.now();
      institute = new Institute({
        id: generatedId,
        ...updateObj
      });
      await institute.save();
    }
    res.json(institute);
  } catch (err) {
    console.error("Error saving admin institute details:", err);
    res.status(500).json({ error: "Failed to save institute" });
  }
});

// 12. Admin Delete Institute
app.delete("/api/admin/institutes/:id", async (req, res) => {
  try {
    const deleted = await Institute.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Institute not found" });
    // Also delete associated reviews
    await InstituteReview.deleteMany({ instituteId: req.params.id });
    res.json({ message: "Institute deleted successfully" });
  } catch (err) {
    console.error("Error deleting institute:", err);
    res.status(500).json({ error: "Failed to delete institute" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`CertifyHub API server is running on port ${PORT}`);
});
