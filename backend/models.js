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
