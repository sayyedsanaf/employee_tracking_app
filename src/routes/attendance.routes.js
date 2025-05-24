import express from "express";
import {
  checkIn,
  checkOut,
  getAllAttendance,
  getDailyAttendanceSummary,
  getMonthlyAttendanceSummary,
  getMyAttendance,
} from "../controllers/attendance.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes for employees
router.post("/check-in", protect, authorizeRoles("employee"), checkIn);
router.post("/check-out", protect, authorizeRoles("employee"), checkOut);
router.get('/me', protect, authorizeRoles('employee'), getMyAttendance);

// Admin-only summary endpoints
router.get('/', protect, authorizeRoles('admin'), getAllAttendance);
router.get("/daily-summary", protect, authorizeRoles("admin"), getDailyAttendanceSummary);
router.get("/monthly-summary", protect, authorizeRoles("admin"), getMonthlyAttendanceSummary);

export default router;
