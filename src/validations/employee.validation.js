// src/validators/employee.validator.js
import { z } from "zod";

export const employeeSchema = z.object({
  userId: z.string().length(24, "Invalid userId"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  salary: z.number().positive("Salary must be a positive number"),
});
