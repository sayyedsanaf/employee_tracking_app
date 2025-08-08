// models/visit.model.js
import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    meetingType: {
      type: String,
      enum: ["in-person", "virtual"],
      required: true,
    },
    meetingPurpose: {
      type: String,
      required: true,
    },
    meetingNotes: {
      type: String,
    },
    meetingDate: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    meetingStartedAt: {
      type: Date,
      required: true,
    },
    meetingEndedAt: {
      type: Date,
      required: true,
    },

    clientName: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    clientImage: {
      type: String,
    },
    location: {
      type: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      required: true,
    },
    selfie: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "started", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
