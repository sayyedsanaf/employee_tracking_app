// models/location.model.js
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
  },
  locationImages: [
    {
      type: String, // each will be a Cloudinary URL
    },
  ],
  purpose: {
    type: String,
    required: true,
  },
  visitedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Location", locationSchema);
