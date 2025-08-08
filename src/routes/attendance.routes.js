import express from "express";
import {
  checkIn,
  checkOut,
  getAbsentEmployees,
  getAllAttendance,
  getDailyAttendanceSummary,
  getMonthlyAttendanceSummary,
  getMyAttendance,
  getPresentEmployees,
} from "../controllers/attendance.controller.js";
import {
  verifyToken,
  authorizeRoles,
  verifyEmployee,
  verifyCompany,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes for employees
router.post(
  "/check-in",
  verifyToken,
  verifyEmployee,
  authorizeRoles("employee"),
  checkIn
);
router.post(
  "/check-out",
  verifyToken,
  verifyEmployee,
  authorizeRoles("employee"),
  checkOut
);
router.get(
  "/me",
  verifyToken,
  verifyEmployee,
  authorizeRoles("employee"),
  getMyAttendance
);

// Admin-only summary endpoints
router.get("/", verifyToken, authorizeRoles("admin"), getAllAttendance);
router.get(
  "/daily-summary",
  verifyToken,
  authorizeRoles("admin"),
  getDailyAttendanceSummary
);
router.get(
  "/monthly-summary",
  verifyToken,
  authorizeRoles("admin"),
  getMonthlyAttendanceSummary
);

// @route GET /api/attendance/present
// @desc Get present employees today
router.get(
  "/present",
  verifyToken,
  verifyCompany,
  authorizeRoles("admin"),
  getPresentEmployees
);

// @route GET /api/attendance/absent
// @desc Get absent employees today
router.get(
  "/absent",
  verifyToken,
  verifyCompany,
  authorizeRoles("admin"),
  getAbsentEmployees
);

export default router;
