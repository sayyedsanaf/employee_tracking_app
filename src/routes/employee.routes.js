// routes/employee.routes.js
import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller.js';

import { authorizeRoles, verifyCompany, verifyToken } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js'; // For file uploads

const router = express.Router();

// ✅ Create Employee (Admin only, supports file upload)
router.post(
  '/',
  verifyToken,
  verifyCompany,
  authorizeRoles('admin'),
  upload.single('photo'), // multer middleware for file
  createEmployee
);

// ✅ Get All Employees (Admin only)
router.get('/', verifyToken, verifyCompany, authorizeRoles('admin'), getAllEmployees);

// ✅ Get Single Employee by ID (Admin or that employee)
router.get('/:id', verifyToken, verifyCompany, getEmployeeById);

// ✅ Update Employee (Admin only, supports photo upload)
router.put(
  '/:id',
  verifyToken,
  verifyCompany,
  authorizeRoles('admin'),
  upload.single('photo'),
  updateEmployee
);

// ✅ Delete Employee (Admin only)
router.delete('/:id', verifyToken, verifyCompany, authorizeRoles('admin'), deleteEmployee);

export default router;
