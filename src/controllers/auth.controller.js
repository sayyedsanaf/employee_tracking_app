// controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
