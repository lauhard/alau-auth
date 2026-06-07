import { z } from "zod"; 
export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type LoginData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    name: z.string().min(3, "Name must be at least 2 characters long")
});
export type SignupData = z.infer<typeof signupSchema>;