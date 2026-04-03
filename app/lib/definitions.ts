import * as z from "zod";

export const SignupFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { error: "First name must be at least 2 characters long." })
      .trim(),
    lastName: z
      .string()
      .min(2, { error: "Last name must be at least 2 characters long." })
      .trim(),
    email: z.email({ error: "Please enter a valid email." }).trim(),
    accept: z.literal("on", {
      error: "You must accept the terms and conditions.",
    }),
    password: z
      .string()
      .min(6, { error: "Be at least 6 characters long" })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
  });

export type FormState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    accept?: string[];
  };
  message?: string;
  inputs?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    // password?: string
    // confirmPassword?: string
  };
};

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(6, { error: "Be at least 6 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
  rememberMe: z.boolean().optional(),
});

export type LoginFormState = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
  inputs?: {
    email?: string;
    // password?: string
  };
};

export const CreatePostSchema = z.object({
  text: z
    .string()
    .min(1, "Text is required")
    .max(1000, "Text must be at most 1000 characters long"),
  imageUrl: z.url("Invalid image URL").optional().nullable(),
  visibility: z.enum(["public", "private"]).default("public"),
});

export const CreateCommentSchema = z.object({
  commentText: z
    .string()
    .min(1, "Text is required")
    .max(1000, "Text must be at most 1000 characters long"),
  imageUrl: z.url("Invalid image URL").optional().nullable(),
});
