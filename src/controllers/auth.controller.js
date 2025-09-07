// controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  registerCompanySchema,
  loginCompanySchema,
} from "../validations/auth.validation.js";
import Company from "../models/company.model.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUploader.js";

// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    // Check if the request contains a logo file
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Logo is required" });
    }

    // Validate request body
    const { companyName, phone, city, state, country, zipCode, email, password } =
      registerCompanySchema.parse(req.body);

    // Check if the company already exists
    const companyExists = await User.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Upload the logo to Cloudinary
    const logo = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "employeeManagement",
    });

    // Check if the logo upload was successful
    if (!logo) {
      return res.status(500).json({ success: false, message: "Logo upload failed" });
    }

    // Create the company
    const company = await Company.create({
      companyName,
      phone,
      city,
      state,
      country,
      zipCode,
      logo: logo?.secure_url,
      logoPublicId: logo?.public_id,
    });

    const user = await User.create({
      name: companyName,
      email,
      phone,
      password,
      role: "admin",
      companyId: company._id,
    });

    return res.status(201).json({
      success: true,
      message: "Company registered successfully",
      token: user.generateToken(),
      company: {
        _id: company._id,
        companyName: company.companyName,
        email: user.email,
        phone: user.phone,
        city: company.city,
        state: company.state,
        country: company.country,
        zipCode: company.zipCode,
        logo: company.logo,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = loginCompanySchema.parse(req.body);

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: user.generateToken(),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me

export const getMe = (req, res, next) => {
  try {
    const user = req.user; // The authenticated user from middleware
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (err) {
    next(err);
  }
};
