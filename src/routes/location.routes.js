import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  logLocation,
  getMyLocations,
  getEmployeeLocations,
} from "../controllers/location.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

// Employee logs a visit
router.post(
  "/",
  protect,
  authorizeRoles("employee"),
  upload.array("locationImages", 5),
  logLocation
);

// Employee views their own visits
router.get("/me", protect, authorizeRoles("employee"), getMyLocations);

// Admin views employee visits by ID
router.get("/:id", protect, authorizeRoles("admin"), getEmployeeLocations);

export default router;
