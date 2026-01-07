import { z } from "zod";

export const registerSchema = z.object({
  firstname: z.string().min(2, "Name must be at least 2 characters long"),
  lastname: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateUserSchema = z
  .object({
    firstname: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .optional(),
    lastname: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .optional(),
    email: z.email("Invalid email address").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field must be provided for update",
    }
  );

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
