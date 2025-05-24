import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  checkOutTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['checked-in', 'checked-out'],
    default: 'checked-in',
  },
  date: {
  type: String, // Format: YYYY-MM-DD
  required: true,
},

}, { timestamps: true });

export default mongoose.model('CheckIn', checkInSchema);
