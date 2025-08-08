import Attendance from "../models/attendance.model.js";
import Employee from "../models/employee.model.js";
import dayjs from "dayjs";

// @route POST /api/attendance/check-in
// @desc Check in an employee
export const checkIn = async (req, res, next) => {
  try {
    const employeeId = req.employee._id;
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let attendance = await Attendance.findOne({ employeeId, date: dateOnly });

    if (!attendance) {
      // No record for today, create a new one with the first session
      attendance = await Attendance.create({
        employeeId,
        date: dateOnly,
        status: "present",
        sessions: [{ checkIn: new Date() }],
        companyId: req.user.companyId, // Use the company ID from the authenticated user
      });
    } else {
      const lastSession = attendance.sessions[attendance.sessions.length - 1];

      if (lastSession && !lastSession.checkOut) {
        return res.status(400).json({
          success: false,
          message: "You have already checked in and not checked out yet.",
        });
      }

      // Add a new check-in session
      attendance.sessions.push({ checkIn: new Date() });
      await attendance.save();
    }

    res.status(200).json({ success: true, attendance });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/attendance/check-out
// @desc Check out an employee
export const checkOut = async (req, res, next) => {
  try {
    const employeeId = req.employee._id;
    console.log(req.user.userId);
    console.log(employeeId);
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const attendance = await Attendance.findOne({ employeeId, date: dateOnly });

    if (!attendance || attendance.sessions.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No active check-in session." });
    }

    const lastSession = attendance.sessions[attendance.sessions.length - 1];

    if (lastSession.checkOut) {
      return res
        .status(400)
        .json({ success: false, message: "Already checked out for the last session." });
    }

    lastSession.checkOut = new Date();
    await attendance.save();

    res.status(200).json({ success: true, attendance });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/attendance/me
// @desc Get my attendance records
export const getMyAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ employeeId: req.employee._id }).sort({
      date: -1,
    });
    res.status(200).json({ success: true, attendance });
  } catch (err) {
    next(err);
  }
};

export const getPresentEmployees = async (req, res, next) => {
  try {
    const start = req.query.date ? new Date(req.query.date) : new Date();
    start.setHours(0, 0, 0, 0);

    const end = req.query.date ? new Date(req.query.date) : new Date();
    end.setHours(23, 59, 59, 999);
    console.log(start, end);
    // console.log(req.company._id);
    const attendance = await Attendance.find({
      $and: [
        { date: { $gte: start, $lte: end } },
        { status: "present" },
        { companyId: req.company._id },
      ],
    }).select("employeeId");
    // console.log(attendance);

    if (!attendance || attendance.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No present employees found" });
    }

    const presentEmployees = await Employee.find({
      _id: { $in: attendance.map((a) => a.employeeId) },
      companyId: req.company._id,
    }).populate("userId", "name email");

    return res.status(200).json({ success: true, data: presentEmployees });
  } catch (error) {
    next(error);
  }
};

export const getAbsentEmployees = async (req, res, next) => {
  try {
    const start = req.query.date ? new Date(req.query.date) : new Date();
    start.setHours(0, 0, 0, 0);

    const end = req.query.date ? new Date(req.query.date) : new Date();
    end.setHours(23, 59, 59, 999);
    console.log(start, end);
    const attendance = await Attendance.find({
      $and: [
        { date: { $gte: start, $lte: end } },
        { status: "present" },
        { companyId: req.company._id },
      ],
    }).select("employeeId");

    if (!attendance || attendance.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No present employees found" });
    }
    // Find employees who are not present today
    const employees = await Employee.find({
      _id: { $nin: attendance.map((a) => a.employeeId) },
      companyId: req.company._id,
    }).populate("userId", "name email");

    return res.status(200).json({ success: true, data: employees });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/attendance/all
// @desc Get all attendance records
export const getAllAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find()
      .populate("employeeId", "name email")
      .sort({ date: -1 });
    res.status(200).json({ success: true, records });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/attendance/daily-summary
// @desc Get daily attendance summary
export const getDailyAttendanceSummary = async (req, res, next) => {
  try {
    const today = dayjs().startOf("day").toDate();
    const attendances = await Attendance.find({ date: today }).populate(
      "employeeId",
      "name email"
    );

    res.status(200).json({ success: true, data: attendances });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/attendance/monthly-summary
// @desc Get monthly attendance summary
export const getMonthlyAttendanceSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const start = dayjs(`${year}-${month}-01`).startOf("month").toDate();
    const end = dayjs(start).endOf("month").toDate();

    const records = await Attendance.find({
      date: { $gte: start, $lte: end },
    }).populate("employeeId", "name email");

    res.status(200).json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};
