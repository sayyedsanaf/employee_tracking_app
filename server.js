import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/utils/db.js";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import employeeRoutes from "./src/routes/employee.routes.js";
import locationRoutes from "./src/routes/location.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import devRoutes from "./src/routes/dev.routes.js";
import visitRoutes from "./src/routes/visit.routes.js"
// Middlewares
import errorHandler from "./src/middlewares/error.middleware.js";

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// DB Connection
connectDB();

// server.js (add after DB connection)
import "./src/jobs/attendanceScheduler.js";


// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form-data

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/visit", visitRoutes);
app.use("/api/dev", devRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
