import CheckIn from '../models/checkin.model.js';
import moment from "moment";

export const checkIn = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;

    // Check if already checked-in and not checked-out
    const ongoing = await CheckIn.findOne({ employeeId, status: 'checked-in' });
    if (ongoing) {
      return res.status(400).json({ success: false, message: 'Already checked in. Please check out first.' });
    }

    const record = await CheckIn.create({ employeeId });
    res.status(201).json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

export const checkOut = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;

    const record = await CheckIn.findOne({ employeeId, status: 'checked-in' });
    if (!record) {
      return res.status(400).json({ success: false, message: 'No active check-in found' });
    }

    record.checkOutTime = new Date();
    record.status = 'checked-out';
    await record.save();

    res.status(200).json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

// GET /api/checkins/summary?date=2025-05-21
export const getDailyAttendance = async (req, res, next) => {
  try {
    const date = req.query.date || moment().format("YYYY-MM-DD");

    const records = await CheckIn.find({ date })
      .populate("employeeId", "name email");

    res.status(200).json({ success: true, date, attendance: records });
  } catch (err) {
    next(err);
  }
};
