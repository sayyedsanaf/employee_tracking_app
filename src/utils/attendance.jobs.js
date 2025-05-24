// src/utils/attendance.jobs.js
import Attendance from "../models/attendance.model.js";
import Employee from "../models/employee.model.js";
import dayjs from "dayjs";

// Auto mark absent for employees who didn’t check in today
export const markAbsentForToday = async () => {
  try {
    const today = dayjs().startOf("day").toDate();

    const allEmployees = await Employee.find();
    const attendedToday = await Attendance.find({ date: today }).select("employeeId");

    const attendedIds = attendedToday.map((a) => a.employeeId.toString());

    const absentEmployees = allEmployees.filter(
      (emp) => !attendedIds.includes(emp._id.toString())
    );

    const absentEntries = absentEmployees.map((emp) => ({
      employeeId: emp._id,
      date: today,
      status: "absent",
      sessions: [],
    }));

    if (absentEntries.length) {
      await Attendance.insertMany(absentEntries);
      console.log("Absent marked for:", absentEmployees.length);
    }
  } catch (err) {
    console.error("Error marking absent:", err.message);
  }
};

// Auto check-out any open session older than 8 hours
export const autoCheckoutEmployees = async () => {
  try {
    const today = dayjs().startOf("day").toDate();
    const records = await Attendance.find({
      date: today,
      status: "present",
      "sessions.checkOut": { $exists: false },
    });

    const now = new Date();
    const eightHours = 8 * 60 * 60 * 1000;

    for (let record of records) {
      let updated = false;

      for (let session of record.sessions) {
        if (!session.checkOut) {
          const checkInTime = new Date(session.checkIn).getTime();
          if (now.getTime() - checkInTime >= eightHours) {
            session.checkOut = new Date(checkInTime + eightHours);
            updated = true;
          }
        }
      }

      if (updated) {
        await record.save();
        console.log("Auto checked-out:", record.employeeId);
      }
    }
  } catch (err) {
    console.error("Error auto check-out:", err.message);
  }
};
