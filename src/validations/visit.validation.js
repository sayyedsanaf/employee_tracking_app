import z from "zod";

export const visitSchema = z.object({
  employeeId: z.string().min(14),
  locationName: z.string().min(3),
  latitude: z.coerce.number(), // <== converts "26.85" to 26.85
  longitude: z.coerce.number(),
  address: z.string().optional(),
  purpose: z.string().min(3, "Purpose is required"),
});
