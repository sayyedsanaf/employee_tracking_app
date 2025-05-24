// controllers/employee.controller.js
import mongoose from "mongoose";
import Employee from "../models/employee.model.js";
import { employeeSchema } from "../validations/employee.validation.js";
import { cloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";

// Helper to upload to Cloudinary
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "employees" }, (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      })
      .end(buffer);
  });
};

// ✅ POST /api/employees (Admin only)
export const createEmployee = async (req, res, next) => {
  try {
    console.log("➡️ Creating Employee");

    // Zod validation
    const { userId, department, position, salary } = employeeSchema.parse(req.body);

    // Validate ObjectId manually (optional after Zod)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent duplicate employee for the same user
    const existing = await Employee.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists for this user",
      });
    }

    // Handle optional photo upload
    let photoUrl = "";
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Create employee
    const newEmployee = await Employee.create({
      userId,
      department,
      position,
      salary,
      photo: photoUrl,
    });

    res.status(201).json({ success: true, employee: newEmployee });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/employees (Admin only)
export const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().populate("userId", "name email role");
    res.status(200).json({ success: true, employees });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/employees/:id (Admin or owner)
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "userId",
      "name email role"
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // If not admin, allow only the owner of the profile
    if (
      req.user.role !== "admin" &&
      employee.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, employee });
  } catch (err) {
    next(err);
  }
};

// ✅ PUT /api/employees/:id (Admin only)
export const updateEmployee = async (req, res, next) => {
  try {
    const { department, position, salary } = employeeSchema.partial().parse(req.body);

    const updateData = { department, position, salary };

    if (req.file) {
      const photoUrl = await uploadToCloudinary(req.file.buffer);
      updateData.photo = photoUrl;
    }

    const updated = await Employee.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, employee: updated });
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE /api/employees/:id (Admin only)
export const deleteEmployee = async (req, res, next) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
};
