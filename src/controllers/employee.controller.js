// controllers/employee.controller.js
import Employee from "../models/employee.model.js";
import { employeeSchema } from "../validations/employee.validation.js";
import User from "../models/user.model.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUploader.js";
import Attendance from "../models/attendance.model.js";

// @route POST /api/employees
// @desc Create a new employee (Admin only, supports file upload)
export const createEmployee = async (req, res, next) => {
  try {
    // Check if the request contains a photo file
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Photo is required" });
    }

    // Validate request body
    const {
      employeeName,
      department,
      designation,
      salary,
      joiningDate,
      status,
      email,
      phone,
      password,
    } = employeeSchema.parse(req.body);

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Upload the photo to Cloudinary
    const photo = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "employeeManagement",
    });

    // Check if the photo upload was successful
    if (!photo) {
      return res.status(500).json({ success: false, message: "Photo upload failed" });
    }

    // Create the user
    const user = await User.create({
      name: employeeName,
      email,
      phone,
      password,
      role: "employee",
      companyId: req.user.companyId, // Use the company ID from the authenticated user
    });

    // Create the employee
    const employee = await Employee.create({
      employeeName,
      department,
      designation,
      salary,
      joiningDate,
      status,
      companyId: req.user.companyId,
      userId: user._id,
      photo: photo?.secure_url,
      photoPublicId: photo?.public_id,
    });

    return res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      employee: {
        _id: employee._id,
        employeeName: employee.employeeName,
        department: employee.department,
        designation: employee.designation,
        salary: employee.salary,
        joiningDate: employee.joiningDate,
        status: employee.status,
        companyId: employee.companyId,
        userId: employee.userId,
        email: user.email,
        phone: user.phone,
        photo: employee.photo,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/employees
// @desc Get all employees (Admin only)
export const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({ companyId: req.company._id }).populate(
      "userId",
      "name email role"
    );
    res.status(200).json({ success: true, employees });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/employees/:id
// @desc Get a single employee by ID (Admin or that employee)
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      $and: [{ _id: req.params.id }, { companyId: req.company._id }],
    }).populate("userId", "name email role");

    console.log(employee);
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

// @route PUT /api/employees/:id
// @desc Update an employee (Admin only)
export const updateEmployee = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/employees/:id
// @desc Delete an employee (Admin only)
export const deleteEmployee = async (req, res, next) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const deletedUser = await User.findByIdAndDelete(deletedEmployee.userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const deletedAttendance = await Attendance.deleteMany({ employeeId: req.params.id });

    res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (err) {
    next(err);
  }
};
