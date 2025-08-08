// src/validators/employee.validator.js
import { z } from "zod";

export const employeeSchema = z.object({
  employeeName: z.string().min(3, "Employee name must be at least 3 characters long"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long").max(15, "Phone number must not exceed 15 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  salary: z.string().min(1, "Salary is required").regex(/^\d+$/, "Salary must be a valid number"),
  joiningDate: z.date().optional(),
  status: z.enum(["active", "inactive", "terminated"]).default("active"),
});
