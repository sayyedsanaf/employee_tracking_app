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

// @ROUTE GET /api/visits - Get all visits(employee visits)
export const getVisits = async (req, res, next) => {
  try {
    const visits = await Visit.find({ employeeId: req.employee._id }).populate(
      "employeeId",
      "name email"
    );
    res.status(200).json({ success: true, visits });
  } catch (error) {
    next(error);
  }
};

// @ROUTE POST /api/visits - Create a visit
// @DESC Create a visit for an employee
// @ACCESS Private (Employee)
export const createVisit = async (req, res, next) => {
  try {
    const {
      meetingType,
      meetingPurpose,
      meetingNotes,
      meetingStartedAt,
      meetingEndedAt,
      clientName,
      clientPhone,
      clientPhoto,
      location,
      selfie,
    } = req.body;
  } catch (error) {
    next(error);
  }
};

// @ROUTE POST /api/visits/all - Get all visits (Admin)
export const getAllVisits = async (req, res, next) => {
  try {
    const visits = await Visit.find({ companyId: req.user.companyId }).populate(
      "employeeId",
      "name email"
    );
    res.status(200).json({ success: true, visits });
  } catch (error) {
    next(error);
  }
};

// @ROUTE POST /api/visits/:id - Update a visit (Admin)
export const updateVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!visit) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }
    res.status(200).json({ success: true, visit });
  } catch (error) {
    next(error);
  }
};

// @ROUTE GET /api/visits/:id - Get a specific visit (Admin | Employee)
export const getVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id).populate("employeeId", "name email");
    if (!visit) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }
    res.status(200).json({ success: true, visit });
  } catch (error) {
    next(error);
  }
}

// @ROUTE DELETE /api/visits/:id - Delete a visit (Admin)
// This route allows an admin to delete a visit by its ID
export const deleteVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findByIdAndDelete(id);
    if (!visit) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }
    res.status(200).json({ success: true, message: "Visit deleted successfully" });
  } catch (error) {
    next(error);
  }
}
