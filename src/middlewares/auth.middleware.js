import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Employee from '../models/employee.model.js';

export const protect = async (req, res, next) => {
  let token;

  // ✅ Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;

    // ✅ If user is an employee, fetch their employee ID and attach it
    if (user.role === 'employee') {
      const employee = await Employee.findOne({ userId: user._id }); // better linkage via user._id
      if (employee) {
        req.user.employeeId = employee._id;
      } else {
        console.warn(`⚠️ Employee document not found for user ${user.email}`);
      }
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
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
