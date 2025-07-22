// routes/auth.routes.js
import express from 'express';
import { register, login, registerCompany, loginCompany } from '../controllers/auth.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/company/register', upload.single('logo'), registerCompany);
router.post('/register', register);
router.post('/company/login', loginCompany);
router.post('/login', login);

export default router;
