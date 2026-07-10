import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course, Job, Institute, InstituteReview, User, UserPreference, ComparisonHistory, UserInquiry, SavedInstitute, LoginHistory } from "./models.js";
import { SEED_COURSES, SEED_JOBS, SEED_INSTITUTES, SEED_REVIEWS } from "./seedData.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/certifyhub";

console.log("Connecting to MongoDB for database reset...");
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to database. Dropping collections...");

    try {
      await Course.deleteMany({});
      await Job.deleteMany({});
      await Institute.deleteMany({});
      await InstituteReview.deleteMany({});
      await User.deleteMany({});
      await UserPreference.deleteMany({});
      await ComparisonHistory.deleteMany({});
      await UserInquiry.deleteMany({});
      await SavedInstitute.deleteMany({});
      await LoginHistory.deleteMany({});
      console.log("All collections cleared successfully.");

      console.log("Seeding collections...");
      await Course.insertMany(SEED_COURSES);
      console.log(`Seeded ${SEED_COURSES.length} courses.`);

      await Job.insertMany(SEED_JOBS);
      console.log(`Seeded ${SEED_JOBS.length} jobs.`);

      await Institute.insertMany(SEED_INSTITUTES);
      console.log(`Seeded ${SEED_INSTITUTES.length} institutes.`);

      await InstituteReview.insertMany(SEED_REVIEWS);
      console.log(`Seeded ${SEED_REVIEWS.length} reviews.`);

      console.log("Database reset and seeding completed successfully.");
    } catch (err) {
      console.error("Error during database reset:", err.message);
    } finally {
      await mongoose.connection.close();
      console.log("Database connection closed.");
      process.exit(0);
    }
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
