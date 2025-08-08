// src/createServer.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import locationRoutes from "./routes/location.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import devRoutes from "./routes/dev.routes.js";
import visitRoutes from "./routes/visit.routes.js";

// Middlewares
import errorHandler from "./middlewares/error.middleware.js";

// Cron Jobs
import "./jobs/attendanceScheduler.js";

// Config
dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Employee Management App API",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/dev", devRoutes);

// Error handler
app.use(errorHandler);

export default app;
