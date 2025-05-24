import express from 'express';
import { checkIn, checkOut, getDailyAttendance } from '../controllers/checkin.controller.js';
import { protect, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/checkin', protect, authorizeRoles('employee'), checkIn);
router.post('/checkout', protect, authorizeRoles('employee'), checkOut);
router.get('/summary', protect, authorizeRoles('admin'), getDailyAttendance);

export default router;
