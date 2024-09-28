import { z } from "zod";

export const userSignUpSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(5, {
      message: 'Email must be at least 5 characters.',
    })
    .email({ message: 'Email address must be a valid email' })
    .max(50)
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
  usernameOrEmail: z
    .string({
      required_error: 'Username or email is required',
      invalid_type_error: 'Username or email must be a string',
    })
    .min(5, {
      message: 'Username or email must be at least 5 characters.',
    })
    .max(50)
    .trim(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(2, {
      message: 'Password must be at least 2 characters.',
    })
    .max(50)
    .trim(),
});

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



export type UserLogInSchema = z.infer<typeof userLogInSchema>;
export type SignUpSchema = z.infer<typeof userSignUpSchema>;
