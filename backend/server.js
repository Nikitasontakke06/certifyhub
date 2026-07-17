import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import zlib from "node:zlib";
import "./db.js"; // Connects to MongoDB and seeds data
import { User, Course, Job, JobTrendHistory, UserPreference, ComparisonHistory, Institute, InstituteReview, UserInquiry, SavedInstitute, LoginHistory, UserRoadmapProgress } from "./models.js";
import { protect } from "./auth.js";
import "./scheduler.js"; // Starts cron schedule runner

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json({ limit: "24mb" }));

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is", "it", "of", "on", "or", "that", "the", "to", "with", "will", "this", "these", "those", "using", "use", "course", "students", "student", "learn", "learning", "introduction", "overview", "understanding", "basic", "basics", "advanced", "module", "topics"
]);

function decodePdfString(value) {
  return value
    .replace(/\\([()\\])/g, "$1")
    .replace(/\\n/g, " ")
    .replace(/\\r/g, " ")
    .replace(/\\t/g, " ")
    .replace(/\\([0-7]{1,3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)));
}

// Handles text-based PDFs, including the common FlateDecode-compressed streams.
// Scanned/image-only PDFs do not contain extractable text and should be pasted as text instead.
function extractPdfText(base64) {
  const buffer = Buffer.from(base64.replace(/^data:application\/pdf(?:;[^,]*)?,/, ""), "base64");
  let source = buffer.toString("latin1");
  const streams = [];
  const streamPattern = /<<(.*?)>>\s*stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match;
  while ((match = streamPattern.exec(source))) {
    let stream = Buffer.from(match[2], "latin1");
    if (/\/FlateDecode/.test(match[1])) {
      try { stream = zlib.inflateSync(stream); } catch { continue; }
    }
    streams.push(stream.toString("latin1"));
  }
  source = streams.join(" ") || source;
  const text = [];
  const arrayPattern = /\[([\s\S]*?)\]\s*TJ|\((?:\\.|[^\\()])*\)\s*Tj/g;
  while ((match = arrayPattern.exec(source))) {
    const strings = match[0].match(/\((?:\\.|[^\\()])*\)/g) || [];
    strings.forEach((part) => text.push(decodePdfString(part.slice(1, -1))));
  }
  return text.join(" ").replace(/\s+/g, " ").trim();
}

function syllabusTerms(text) {
  return new Set((text.toLowerCase().match(/[a-z][a-z0-9+#.-]{2,}/g) || [])
    .map((word) => word.replace(/^[^a-z]+|[^a-z0-9+#]+$/g, ""))
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word)));
}

// Compare two student-provided syllabi using Jaccard similarity of meaningful terms.
app.post("/api/syllabus-overlap", (req, res) => {
  try {
    const { syllabusA = "", syllabusB = "", pdfA, pdfB } = req.body || {};
    const textA = `${syllabusA} ${pdfA ? extractPdfText(pdfA) : ""}`.trim();
    const textB = `${syllabusB} ${pdfB ? extractPdfText(pdfB) : ""}`.trim();
    const termsA = syllabusTerms(textA);
    const termsB = syllabusTerms(textB);
    if (!termsA.size || !termsB.size) {
      return res.status(400).json({ error: "Add readable syllabus text or a text-based PDF for both courses." });
    }
    const shared = [...termsA].filter((term) => termsB.has(term)).sort();
    const unionSize = new Set([...termsA, ...termsB]).size;
    const score = Math.round((shared.length / unionSize) * 100);
    res.json({
      score,
      sharedTerms: shared.slice(0, 18),
      onlyInA: [...termsA].filter((term) => !termsB.has(term)).sort().slice(0, 10),
      onlyInB: [...termsB].filter((term) => !termsA.has(term)).sort().slice(0, 10),
      termCounts: { a: termsA.size, b: termsB.size, shared: shared.length }
    });
  } catch (err) {
    console.error("Syllabus overlap error:", err);
    res.status(400).json({ error: "We could not read that syllabus. Try pasting the text from the PDF instead." });
  }
});

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

    // Generate JWT
    const token = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET || "default_jwt_secret_key_9876",
      { expiresIn: "7d" }
    );

    res.status(201).json({ email: newUser.email, token });
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
    // Find matching user in MongoDB by email
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      // Save login history log
      const loginLog = new LoginHistory({
        userEmail: user.email.toLowerCase(),
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || ""
      });
      await loginLog.save();

      // Generate JWT
      const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET || "default_jwt_secret_key_9876",
        { expiresIn: "7d" }
      );

      res.json({ email: user.email, token });
    } else {
      res.status(401).json({ error: "Invalid email or password." });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error during validation." });
  }
});

// 4b. Endpoint: Mock Google Auth Endpoint to issue JWTs
app.post("/api/auth/google-mock", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // Create user with a random mock password
      user = new User({
        email,
        password: "google_mock_password_" + Math.random().toString(36).substring(2)
      });
      await user.save();
    }
    
    // Save login history log
    const loginLog = new LoginHistory({
      userEmail: user.email.toLowerCase(),
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || ""
    });
    await loginLog.save();

    // Generate JWT
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || "default_jwt_secret_key_9876",
      { expiresIn: "7d" }
    );

    res.json({ email: user.email, token });
  } catch (err) {
    console.error("Google auth mock error:", err);
    res.status(500).json({ error: "Database error during Google authentication." });
  }
});

// --- Profile & Preferences Endpoints ---

// 5. Get User Preferences (Secured)
app.get("/api/preferences", protect, async (req, res) => {
  const email = req.user.email;
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

// 6. Update User Preferences (Secured)
app.post("/api/preferences", protect, async (req, res) => {
  const email = req.user.email;
  const { preferredDomains, skillLevel, budgetLimit, preferredPlatforms, emailNotifications, themePreference } = req.body;
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

// 7. Get Recommendations based on Preferences (Optionally Secured)
app.get("/api/recommendations", async (req, res) => {
  let email = req.query.email;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_key_9876");
      email = decoded.email;
    } catch (e) {
      console.warn("[Recommendations] JWT verification ignored:", e.message);
    }
  }

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

// 8. Fetch Comparison History (Secured)
app.get("/api/comparison-history", protect, async (req, res) => {
  const email = req.user.email;
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

// 9. Save Comparison History (Secured)
app.post("/api/comparison-history", protect, async (req, res) => {
  const email = req.user.email;
  const { courseIds } = req.body;
  if (!courseIds || !Array.isArray(courseIds) || courseIds.length < 2) {
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

// 10. Change Password (Secured)
app.post("/api/auth/change-password", protect, async (req, res) => {
  const email = req.user.email;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(currentPassword))) {
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

// 4. Submit review for an institute (Secured)
app.post("/api/institutes/:id/reviews", protect, async (req, res) => {
  const userEmail = req.user.email;
  const { userName, rating, text, pros, cons } = req.body;
  const instituteId = req.params.id;

  if (!userName || !rating || !text) {
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

// 5. Like a review (Secured)
app.post("/api/institutes/:id/reviews/:reviewId/like", protect, async (req, res) => {
  const email = req.user.email;
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

// 6. Submit user inquiry / callback / demo bookings (Secured)
app.post("/api/inquiries", protect, async (req, res) => {
  const userEmail = req.user.email;
  const { instituteId, instituteName, courseId, courseName, type, message } = req.body;
  if (!instituteId || !instituteName || !type) {
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

// 7. Get user inquiries (Secured)
app.get("/api/inquiries", protect, async (req, res) => {
  const email = req.user.email;
  try {
    const inquiries = await UserInquiry.find({ userEmail: email.toLowerCase() }).sort({ date: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

// 8. Update inquiry status (Secured Admin)
app.post("/api/inquiries/:id/status", protect, async (req, res) => {
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

// 9. Get saved offline institutes/courses bookmarks (Secured)
app.get("/api/saved-institutes", protect, async (req, res) => {
  const email = req.user.email;
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

// 10. Toggle bookmark (saved institutes or saved courses) (Secured)
app.post("/api/saved-institutes/toggle", protect, async (req, res) => {
  const email = req.user.email;
  const { instituteId, courseId } = req.body;
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

// 11. Admin Add or Edit Institute (Secured Admin)
app.post("/api/admin/institutes", protect, async (req, res) => {
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

// 12. Admin Delete Institute (Secured Admin)
app.delete("/api/admin/institutes/:id", protect, async (req, res) => {
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

// --- Roadmap Progress Endpoints ---

// Get or initialize progress for a specific roadmap
app.get("/api/roadmap-progress/:roadmapId", protect, async (req, res) => {
  const email = req.user.email;
  const { roadmapId } = req.params;
  try {
    let progress = await UserRoadmapProgress.findOne({
      userEmail: email.toLowerCase(),
      roadmapId
    });
    if (!progress) {
      progress = new UserRoadmapProgress({
        userEmail: email.toLowerCase(),
        roadmapId,
        completedSteps: [],
        completedCourses: []
      });
      await progress.save();
    }
    res.json(progress);
  } catch (err) {
    console.error("Error fetching roadmap progress:", err);
    res.status(500).json({ error: "Failed to fetch roadmap progress" });
  }
});

// Toggle a completed step
app.post("/api/roadmap-progress/:roadmapId/toggle-step", protect, async (req, res) => {
  const email = req.user.email;
  const { roadmapId } = req.params;
  const { stepId } = req.body;

  if (!stepId) {
    return res.status(400).json({ error: "stepId is required" });
  }

  try {
    let progress = await UserRoadmapProgress.findOne({
      userEmail: email.toLowerCase(),
      roadmapId
    });

    if (!progress) {
      progress = new UserRoadmapProgress({
        userEmail: email.toLowerCase(),
        roadmapId,
        completedSteps: [],
        completedCourses: []
      });
    }

    const index = progress.completedSteps.indexOf(stepId);
    if (index === -1) {
      progress.completedSteps.push(stepId);
    } else {
      progress.completedSteps.splice(index, 1);
    }
    
    progress.lastUpdated = new Date();
    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error("Error toggling step progress:", err);
    res.status(500).json({ error: "Failed to toggle step progress" });
  }
});

// Toggle a completed course
app.post("/api/roadmap-progress/:roadmapId/toggle-course", protect, async (req, res) => {
  const email = req.user.email;
  const { roadmapId } = req.params;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: "courseId is required" });
  }

  try {
    let progress = await UserRoadmapProgress.findOne({
      userEmail: email.toLowerCase(),
      roadmapId
    });

    if (!progress) {
      progress = new UserRoadmapProgress({
        userEmail: email.toLowerCase(),
        roadmapId,
        completedSteps: [],
        completedCourses: []
      });
    }

    const index = progress.completedCourses.indexOf(courseId);
    if (index === -1) {
      progress.completedCourses.push(courseId);
    } else {
      progress.completedCourses.splice(index, 1);
    }

    progress.lastUpdated = new Date();
    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error("Error toggling course progress:", err);
    res.status(500).json({ error: "Failed to toggle course progress" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`CertifyHub API server is running on port ${PORT}`);
});
