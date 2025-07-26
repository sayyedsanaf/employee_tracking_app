// controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  registerSchema,
  loginSchema,
  registerCompanySchema,
  loginCompanySchema,
} from "../validations/auth.validation.js";
import Company from "../models/company.model.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUploader.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route POST /api/auth/company/register
export const registerCompany = async (req, res, next) => {
  try {
    // Check if the request contains a logo file
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Logo is required" });
    }

    // Validate request body
    const { name, phone, city, state, country, zipCode, email, password } =
      registerCompanySchema.parse(req.body);

    // Check if the company already exists
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Upload the logo to Cloudinary
    const logo = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "employeeManagement",
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the company
    const company = await Company.create({
      name,
      phone,
      city,
      state,
      country,
      zipCode,
      logo: logo?.secure_url,
      logoPublicId: logo?.public_id,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Company registered successfully",
      token: generateToken(company._id),
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        phone: company.phone,
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

// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/company/login
export const loginCompany = async (req, res, next) => {
  try {
    const { email, password } = loginCompanySchema.parse(req.body);

    const company = await Company.findOne({ email });
    console.log(await bcrypt.compare(password, company.password));
    if (!company || !(await bcrypt.compare(password, company.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(company._id),
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        role: company.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};
