import cron from "node-cron";
import { Job, JobTrendHistory } from "./models.js";

// Baseline job postings for each job type to simulate realistic market scales
const JOB_BASE_OPENINGS = {
  "job-da": 8400,
  "job-sd": 18500,
  "job-fs": 15200,
  "job-cs": 6800,
  "job-bd": 3100,
  "job-dm": 9500
};

// Generates simulated historical openings for the last N days (random walk)
async function seedHistoricalTrends(jobId, baseOpenings) {
  const historyCount = await JobTrendHistory.countDocuments({ jobId });
  if (historyCount === 0) {
    console.log(`Seeding 7-day trend history for job: ${jobId}`);
    const today = new Date();
    
    // Seed points for the last 7 days
    for (let i = 7; i >= 1; i--) {
      const historicalDate = new Date();
      historicalDate.setDate(today.getDate() - i);
      
      // Calculate a random walk variation (e.g. ±8% from baseline)
      const variance = (Math.random() * 0.16) - 0.08;
      const count = Math.round(baseOpenings * (1 + variance));

      const historyPoint = new JobTrendHistory({
        jobId,
        date: historicalDate,
        openingsCount: count
      });
      await historyPoint.save();
    }
  }
}

// Daily update task
export async function updateMarketMetrics() {
  console.log("[Scheduler] Checking and updating market metrics...");
  try {
    let jobs = [];
    let retries = 0;
    while (jobs.length === 0 && retries < 10) {
      jobs = await Job.find({});
      if (jobs.length === 0) {
        console.log("[Scheduler] No jobs found in database. Waiting for seeding to complete (1s)...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
      }
    }

    if (jobs.length === 0) {
      console.log("[Scheduler] No jobs found after retries. Aborting startup update.");
      return;
    }
    
    for (let job of jobs) {
      const baseOpenings = JOB_BASE_OPENINGS[job.id] || 5000;

      // 1. Seed historical data if empty
      await seedHistoricalTrends(job.id, baseOpenings);

      // 2. Generate today's openings count (random walk from baseline)
      const variance = (Math.random() * 0.10) - 0.05; // ±5% daily variance
      const todayOpenings = Math.round(baseOpenings * (1 + variance));

      // 3. Find yesterday's record
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const yesterdayRecord = await JobTrendHistory.findOne({
        jobId: job.id,
        date: { $gte: yesterday }
      }).sort({ date: -1 });

      let dailyGrowthRate = 0.0;
      if (yesterdayRecord && yesterdayRecord.openingsCount > 0) {
        dailyGrowthRate = ((todayOpenings - yesterdayRecord.openingsCount) / yesterdayRecord.openingsCount) * 100;
      } else {
        // Fallback random growth rate if yesterday is not found
        dailyGrowthRate = (Math.random() * 6) - 3; // -3% to +3%
      }

      // 4. Calculate Demand Score
      // Formula: base weight on openings volume and daily growth momentum
      const demandScore = Math.round((todayOpenings * 0.6) + (dailyGrowthRate * 50));

      // 5. Save metrics in job card
      job.activeListingsCount = todayOpenings;
      job.dailyGrowthRate = parseFloat(dailyGrowthRate.toFixed(2));
      job.demandScore = demandScore;
      await job.save();

      // 6. Log today's record (check if already logged today to prevent duplicate logs on restarts)
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      
      const loggedToday = await JobTrendHistory.findOne({
        jobId: job.id,
        date: { $gte: startOfToday }
      });

      if (!loggedToday) {
        const todayRecord = new JobTrendHistory({
          jobId: job.id,
          date: new Date(),
          openingsCount: todayOpenings
        });
        await todayRecord.save();
        console.log(`[Scheduler] Logged daily openings history for ${job.id}: ${todayOpenings}`);
      } else {
        // Update today's record if it's already created
        loggedToday.openingsCount = todayOpenings;
        await loggedToday.save();
      }
    }
    console.log("[Scheduler] Market metrics update completed.");
  } catch (err) {
    console.error("[Scheduler] Error updating market metrics:", err.message);
  }
}

// Cron setup: Runs daily at midnight
cron.schedule("0 0 * * *", () => {
  updateMarketMetrics();
});

// Run once on backend startup to ensure histories and metrics exist
updateMarketMetrics();
