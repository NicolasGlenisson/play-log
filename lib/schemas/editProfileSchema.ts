import { z } from "zod";
// Signup schema used for form validation
export const editProfileSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(50),
});
