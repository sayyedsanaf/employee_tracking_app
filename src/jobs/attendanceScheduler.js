// src/jobs/attendanceScheduler.js
import cron from "node-cron";
import { markAbsentForToday, autoCheckoutEmployees } from "../utils/attendance.jobs.js";

// ⏰ Runs every day at 6:00 PM server time
cron.schedule("0 18 * * *", async () => {
  console.log("🟡 [CRON] Daily Attendance Job Started at 6:00 PM");

  try {
    await markAbsentForToday();
    await autoCheckoutEmployees();
    console.log("✅ [CRON] Daily Attendance Job Completed");
  } catch (error) {
    console.error("❌ [CRON] Attendance Job Failed:", error.message);
  }
});
