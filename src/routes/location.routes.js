import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
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
  verifyToken,
  authorizeRoles("employee"),
  upload.array("locationImages", 5),
  logLocation
);

// Employee views their own visits
router.get("/me", verifyToken, authorizeRoles("employee"), getMyLocations);

// Admin views employee visits by ID
router.get("/:id", verifyToken, authorizeRoles("admin"), getEmployeeLocations);

export default router;
