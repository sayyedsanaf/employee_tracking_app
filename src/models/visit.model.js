// models/visit.model.js
import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  locationName: String,
  latitude: Number,
  longitude: Number,
  address: String,
  purpose: String,
  scheduledAt: Date,
  status: {
    type: String,
    enum: ['assigned', 'completed'],
    default: 'assigned',
  },
  completedAt: Date,
  locationLogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  },
}, { timestamps: true });

export default mongoose.model("Visit", visitSchema);