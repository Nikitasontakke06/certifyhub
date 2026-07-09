import mongoose from "mongoose";

// 1. User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 2. Course Schema
const courseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  reviewsCount: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  }
});

// 3. Job Schema
const jobSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  link: {
    type: String,
    required: true
  },
  demandScore: {
    type: Number,
    default: 0
  },
  activeListingsCount: {
    type: Number,
    default: 0
  },
  dailyGrowthRate: {
    type: Number,
    default: 0
  }
});

// 4. Job Trend History Schema
const jobTrendHistorySchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  openingsCount: {
    type: Number,
    required: true
  }
});

export const User = mongoose.model("User", userSchema);
export const Course = mongoose.model("Course", courseSchema);
export const Job = mongoose.model("Job", jobSchema);
export const JobTrendHistory = mongoose.model("JobTrendHistory", jobTrendHistorySchema);

// 5. User Preference Schema
const userPreferenceSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  preferredDomains: {
    type: [String],
    default: []
  },
  skillLevel: {
    type: String,
    default: "Beginner"
  },
  budgetLimit: {
    type: Number,
    default: 10000
  },
  preferredPlatforms: {
    type: [String],
    default: []
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  themePreference: {
    type: String,
    default: "dark"
  }
});

// 6. Comparison History Schema
const comparisonHistorySchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  courses: [{
    type: String,
    ref: "Course"
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

export const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);
export const ComparisonHistory = mongoose.model("ComparisonHistory", comparisonHistorySchema);

// 7. Institute Course Schema (Subdocument)
const instituteCourseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  mode: { type: String, default: "Offline" }, // Offline or Hybrid
  fees: { type: Number, required: true },
  batchTimings: { type: String, required: true },
  startDate: { type: Date, required: true },
  trainerName: { type: String, required: true },
  certification: { type: String, required: true },
  eligibility: { type: String, required: true },
  syllabus: { type: [String], default: [] },
  placementAssistance: { type: Boolean, default: false }
});

// 8. Institute Schema
const instituteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
  coverImage: { type: String, required: true },
  description: { type: String, required: true },
  establishedYear: { type: Number, required: true },
  categories: { type: [String], default: [] },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String, required: true },
  whatsapp: { type: String, required: true },
  socials: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" }
  },
  address: { type: String, required: true },
  landmarks: { type: [String], default: [] },
  city: { type: String, required: true },
  state: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  infrastructure: { type: [String], default: [] },
  practicalLabs: { type: Boolean, default: true },
  placementRecord: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  courses: [instituteCourseSchema]
});

// 9. Institute Review Schema
const instituteReviewSchema = new mongoose.Schema({
  instituteId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  pros: { type: [String], default: [] },
  cons: { type: [String], default: [] },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] }, // Array of user emails
  date: { type: Date, default: Date.now }
});

// 10. User Inquiry Schema
const userInquirySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  instituteId: { type: String, required: true },
  instituteName: { type: String, required: true },
  courseId: { type: String, default: "" },
  courseName: { type: String, default: "" },
  type: { type: String, required: true }, // "callback", "demo", "visit", "inquiry"
  message: { type: String, default: "" },
  status: { type: String, default: "Pending" }, // Pending, Contacted, Completed
  date: { type: Date, default: Date.now }
});

// 11. Saved Institute Schema (Bookmarks)
const savedInstituteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  savedInstitutes: { type: [String], default: [] }, // Array of instituteIds
  savedInstituteCourses: { type: [String], default: [] } // Array of instituteCourseIds
});

export const Institute = mongoose.model("Institute", instituteSchema);
export const InstituteReview = mongoose.model("InstituteReview", instituteReviewSchema);
export const UserInquiry = mongoose.model("UserInquiry", userInquirySchema);
export const SavedInstitute = mongoose.model("SavedInstitute", savedInstituteSchema);
