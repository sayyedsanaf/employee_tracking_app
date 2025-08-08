// validations/auth.validation.js
import { z } from 'zod';

export const registerCompanySchema = z.object({
  companyName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  zipCode: z.string().min(5).max(10),
  logo: z.string().optional(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginCompanySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
