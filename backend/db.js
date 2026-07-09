import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course, Job, Institute, InstituteReview } from "./models.js";
import { SEED_COURSES, SEED_JOBS, SEED_INSTITUTES, SEED_REVIEWS } from "./seedData.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/certifyhub";

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connection verified successfully.");
    
    // Smart reset check: If USD data is stored, reset to INR
    try {
      const firstCourse = await Course.findOne({ price: { $gt: 0 } });
      if (firstCourse && firstCourse.price < 100) {
        console.log("USD pricing detected. Resetting database to INR...");
        await Course.deleteMany({});
        await Job.deleteMany({});
        await Institute.deleteMany({});
        await InstituteReview.deleteMany({});
      }
    } catch (err) {
      console.warn("Pricing format check warning:", err.message);
    }

    // Seed Courses if empty or count differs (out of sync)
    try {
      const courseCount = await Course.countDocuments();
      if (courseCount !== SEED_COURSES.length) {
        console.log("Database out of sync. Re-seeding courses collection...");
        await Course.deleteMany({});
        await Course.insertMany(SEED_COURSES);
        console.log("Database seeded: Courses collection populated.");
      } else {
        console.log("Courses collection already seeded and up-to-date.");
      }
    } catch (err) {
      console.error("Error seeding courses:", err.message);
    }

    // Seed Jobs if empty
    try {
      const jobCount = await Job.countDocuments();
      if (jobCount !== SEED_JOBS.length) {
        console.log("Database out of sync. Re-seeding jobs collection...");
        await Job.deleteMany({});
        await Job.insertMany(SEED_JOBS);
        console.log("Database seeded: Jobs collection populated.");
      } else {
        console.log("Jobs collection already seeded and up-to-date.");
      }
    } catch (err) {
      console.error("Error seeding jobs:", err.message);
    }

    // Seed Institutes if empty or count differs
    try {
      const instCount = await Institute.countDocuments();
      if (instCount !== SEED_INSTITUTES.length) {
        console.log("Database out of sync. Re-seeding institutes collection...");
        await Institute.deleteMany({});
        await Institute.insertMany(SEED_INSTITUTES);
        console.log("Database seeded: Institutes collection populated.");
      } else {
        console.log("Institutes collection already seeded and up-to-date.");
      }
    } catch (err) {
      console.error("Error seeding institutes:", err.message);
    }

    // Seed Reviews if empty
    try {
      const reviewCount = await InstituteReview.countDocuments();
      if (reviewCount === 0) {
        console.log("Database reviews empty. Seeding reviews collection...");
        await InstituteReview.deleteMany({});
        await InstituteReview.insertMany(SEED_REVIEWS);
        console.log("Database seeded: Reviews collection populated.");
      } else {
        console.log("Reviews collection already seeded and up-to-date.");
      }
    } catch (err) {
      console.error("Error seeding reviews:", err.message);
    }
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
  });

export default mongoose.connection;
