// validations/location.validation.js
import { z } from "zod";

export const locationSchema = z.object({
  latitude: z.coerce.number(),  // <== converts "26.85" to 26.85
  longitude: z.coerce.number(),
  address: z.string().optional(),
  purpose: z.string().min(3, "Purpose is required"),
});
