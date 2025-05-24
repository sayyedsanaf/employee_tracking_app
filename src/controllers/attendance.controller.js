import Attendance from "../models/attendance.model.js";
import Employee from "../models/employee.model.js";
import dayjs from "dayjs";

// POST /api/attendance/check-in
export const checkIn = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
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

// POST /api/attendance/check-out
export const checkOut = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const attendance = await Attendance.findOne({ employeeId, date: dateOnly });

    if (!attendance || attendance.sessions.length === 0) {
      return res.status(400).json({ success: false, message: "No active check-in session." });
    }

    const lastSession = attendance.sessions[attendance.sessions.length - 1];

    if (lastSession.checkOut) {
      return res.status(400).json({ success: false, message: "Already checked out for the last session." });
    }

    lastSession.checkOut = new Date();
    await attendance.save();

    res.status(200).json({ success: true, attendance });
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/me
export const getMyAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ employeeId: req.user.employeeId }).sort({ date: -1 });
    res.status(200).json({ success: true, attendance });
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/all
export const getAllAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find().populate('employeeId', 'name email').sort({ date: -1 });
    res.status(200).json({ success: true, records });
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/daily-summary
export const getDailyAttendanceSummary = async (req, res, next) => {
  try {
    const today = dayjs().startOf("day").toDate();
    const attendances = await Attendance.find({ date: today }).populate("employeeId", "name email");

    res.status(200).json({ success: true, data: attendances });
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/monthly-summary
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
