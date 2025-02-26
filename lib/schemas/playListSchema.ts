import { z } from "zod";

export const playListSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters long"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters long")
    .optional(),
  tags: z
    .string()
    .max(50, "Tags must be at most 50 characters long")
    .optional(),
});
