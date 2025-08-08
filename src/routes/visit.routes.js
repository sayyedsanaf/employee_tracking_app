import express from "express";
import {
  assignVisit,
  createVisit,
  deleteVisit,
  getAllVisits,
  getVisit,
  getVisits,
  updateVisit,
} from "../controllers/visit.controller.js";
import {
  verifyToken,
  authorizeRoles,
  verifyEmployee,
  verifyCompany,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// @ROUTE POST /api/visits/assign - Assign a visit to an employee (Admin)
// @DESC Assign a visit to an employee
// router.post("/assign", verifyToken, verifyCompany, authorizeRoles("admin"), assignVisit);

// Employee Routes
// @ROUTE POST /api/visits - Create a new visit (Employee)
router.post("/", verifyToken, verifyEmployee, authorizeRoles("employee"), createVisit);
// @ROUTE GET /api/visits - Get all visits for an employee
router.get("/", verifyToken, verifyEmployee, authorizeRoles("employee"), getVisits);

// Admin Routes
// @ROUTE GET /api/visits/all - Get all visits (Admin)
router.get("/all", verifyToken, verifyCompany, authorizeRoles("admin"), getAllVisits);
// @ROUTE GET /api/visits/:id - Get a specific visit (Admin | Employee)
router.get(
  "/:id",
  verifyToken,
  verifyCompany,
  authorizeRoles("admin", "employee"),
  getVisit
);
// @ROUTE POST /api/visits/:id - Update a visit (Admin)
router.post("/:id", verifyToken, verifyCompany, authorizeRoles("admin"), updateVisit);
// @ROUTE DELETE /api/visits/:id - Delete a visit (Admin)
router.delete("/:id", verifyToken, verifyCompany, authorizeRoles("admin"), deleteVisit);

export default router;
