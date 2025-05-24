import Visit from "../models/visit.model.js";
import { visitSchema } from "../validations/visit.validation.js"; // optional schema
import Employee from "../models/employee.model.js";

// POST /api/visits - Admin assigns a visit
export const assignVisit = async (req, res, next) => {
  try {
    const {
      employeeId,
      locationName,
      latitude,
      longitude,
      address,
      purpose,
      scheduledAt,
    } = visitSchema.parse(req.body);

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const visit = await Visit.create({
      employeeId,
      assignedBy: req.user._id,
      locationName,
      latitude,
      longitude,
      address,
      purpose,
      scheduledAt,
    });

    res.status(201).json({ success: true, visit });
  } catch (err) {
    next(err);
  }
};
