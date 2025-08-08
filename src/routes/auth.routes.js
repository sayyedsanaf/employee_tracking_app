// routes/auth.routes.js
import express from "express";
import {
  register,
  login,
} from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", upload.single("logo"), register);
router.post("/login", login);

export default router;
