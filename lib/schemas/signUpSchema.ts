import { z } from "zod";
// Signup schema used for form validation
export const signUpSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(50),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
