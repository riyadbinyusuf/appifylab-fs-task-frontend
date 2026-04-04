import * as z from "zod";

export const SignupFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { error: "Minimum 2 characters long." })
      .trim(),
    lastName: z.string().min(2, { error: "Minimum 2 characters long." }).trim(),
    email: z.email({ error: "Invalid email." }).trim(),
    accept: z.literal("on", {
      error: "You must accept the terms and conditions.",
    }),
    password: z
      .string()
      .min(6, { error: "Minimum 6 characters" })
      .regex(/[A-Z]/, { error: "Must include uppercase letter" })
      .regex(/[a-z]/, { error: "Must include lowercase letter" })
      .regex(/[0-9]/, { error: "Must include number." })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Must include special character.",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormErrorsType = {
  formErrors?: string[];
  fieldErrors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    accept?: string[];
  };
};

export type FormState = {
  status?: string;
  errors?: FormErrorsType;
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
  password: z.string().min(1, "Required"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormState = {
  status?: string;
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

export const CreatePostSchema = z
  .object({
    text: z
      .string()
      .trim()
      .max(1000, "Text must be at most 1000 characters long")
      .optional()
      .nullable(),
    imageUrl: z.url("Invalid image URL").optional().nullable(),
    visibility: z.enum(["public", "private"]).default("public"),
  })
  .superRefine((data, ctx) => {
    if (!data.text && !data.imageUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["text"],
        message: "Text or image is required",
      });

      ctx.addIssue({
        code: "custom",
        path: ["imageUrl"],
        message: "Text or image is required",
      });
    }
  });

export type CreatePostType = z.infer<typeof CreatePostSchema>;

export const CreateCommentSchema = z
  .object({
    commentText: z
      .string()
      .trim()
      .max(1000, "Text must be at most 1000 characters long")
      .optional()
      .nullable(),
    imageUrl: z.url("Invalid image URL").optional().nullable(),
    parentId: z.number().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.commentText && !data.imageUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["commentText"],
        message: "Text or image is required",
      });

      ctx.addIssue({
        code: "custom",
        path: ["imageUrl"],
        message: "Text or image is required",
      });
    }
  });
