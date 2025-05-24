import Location from "../models/location.model.js";
import Employee from "../models/employee.model.js";
import { locationSchema } from "../validations/location.validation.js"; // ✅ Zod schema
import { uploadMultipleToCloudinary } from "../utils/cloudinary.js";
import Visit from '../models/visit.model.js'; // Import Visit model

// ✅ POST /api/locations - Log a location visit
export const logLocation = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one location image is required." });
    }

    const { latitude, longitude, address, purpose } = locationSchema.parse(req.body);
    const employeeId = req.user.employeeId;

    if (!employeeId) {
      return res.status(403).json({ success: false, message: "Not an employee" });
    }

    const locationImageUrls = await uploadMultipleToCloudinary(req.files);

    const location = await Location.create({
      employeeId,
      latitude,
      longitude,
      address,
      purpose,
      locationImages: locationImageUrls,
    });

    // ✅ Match any assigned visit
    const pendingVisit = await Visit.findOne({
      employeeId,
      status: 'assigned',
      purpose,
    });

    if (pendingVisit) {
      pendingVisit.status = 'completed';
      pendingVisit.completedAt = new Date();
      pendingVisit.locationLogId = location._id;
      await pendingVisit.save();
    }

    res.status(201).json({ success: true, location, matchedVisit: pendingVisit || null });
  } catch (err) {
    next(err);
  }
};



// ✅ GET /api/locations/me - Get current employee's visits
export const getMyLocations = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee profile not found" });
    }

    const locations = await Location.find({ employeeId: employee._id }).sort({
      visitedAt: -1,
    });
    res.status(200).json({ success: true, locations });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/locations/:id - Admin view of any employee's locations
export const getEmployeeLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({ employeeId: req.params.id })
      .populate("employeeId", "name email") // For admin to identify
      .sort({ visitedAt: -1 });

    res.status(200).json({ success: true, locations });
  } catch (err) {
    next(err);
  }
};
