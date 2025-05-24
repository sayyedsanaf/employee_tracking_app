import express from "express";
import { markAbsentForToday, autoCheckoutEmployees } from "../utils/attendance.jobs.js";

const router = express.Router();

router.get("/run-attendance-jobs", async (req, res) => {
  try {
    await markAbsentForToday();
    await autoCheckoutEmployees();
    res.json({ success: true, message: "Attendance jobs executed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
