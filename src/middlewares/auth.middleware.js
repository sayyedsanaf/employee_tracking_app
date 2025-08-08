import jwt from "jsonwebtoken";

import Company from "../models/company.model.js";
import Employee from "../models/employee.model.js";

export const verifyToken = async (req, res, next) => {
  let token;

  // ✅ Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

export const verifyCompany = async (req, res, next) => {
  const companyId = req.user.companyId;
  // Check if companyId exists in the request user
  if (!companyId) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied, no company ID" });
  }

  try {
    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    // Attach company details to the request object
    req.company = company;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyEmployee = async (req, res, next) => {
  try {
    // Check if the employee exists
    const employee = await Employee.findOne({ userId: req.user.userId });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    // Attach employee details to the request object
    req.employee = employee;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: `Access denied for role: ${req.user.role}` });
    }
    next();
  };
};
