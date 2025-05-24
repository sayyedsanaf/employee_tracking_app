import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    sessions: [
      {
        checkIn: { type: Date, required: true },
        checkOut: { type: Date }, // May be null until checked out
      },
    ],
    status: {
      type: String,
      enum: ["present", "absent"],
      default: "present",
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
export default mongoose.model("Attendance", attendanceSchema);
