import express from 'express';
import { assignVisit } from '../controllers/visit.controller.js';
import { protect, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('admin'), assignVisit);

export default router;
