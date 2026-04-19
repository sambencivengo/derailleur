import { z } from "zod";

export const userSignUpSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30)
    .trim(),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Must be a valid email" })
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(2, {
      message: 'Password must be at least 2 characters.',
    })
    .max(50)
    .trim(),
});

export const userLogInSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(2, { message: 'Username must be at least 2 characters.' })
    .max(30)
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(2, { message: 'Password must be at least 2 characters.' })
    .max(50)
    .trim(),
});

// TODO: fix schema exports
export const editProfilePayloadSchema = z.object({
  location: z.string().optional(),
  favoriteBikes: z.array(z.object({ bike: z.string().min(5, 'Bike names must be at least 5 characters long').max(50, 'Bike names cannot be longer than 50 characters') }))
});
export type EditProfilePayloadSchema = z.infer<typeof editProfilePayloadSchema>;

export const editProfileSchema = z.object({
  location: z.string().optional(),
  favoriteBikes: z.array(z.string().min(5, 'Bike names must be at least 5 characters long').max(50, 'Bike names cannot be longer than 50 characters'))
});
export type EditProfileSchema = z.infer<typeof editProfileSchema>;


export type SignUpSchema = z.infer<typeof userSignUpSchema>;
export type LogInSchema = z.infer<typeof userLogInSchema>;
