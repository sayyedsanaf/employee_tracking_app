// src/models/employee.model.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  photo: {
    type: String, // Cloudinary URL
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
