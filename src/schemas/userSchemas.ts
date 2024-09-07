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

export const editProfilePayloadSchema = z.object({
  location: z.string().optional(),
  favoriteBikes: z.array(z.object({ bike: z.string() }))
});
export type EditProfilePayloadSchema = z.infer<typeof editProfilePayloadSchema>;


export const userLogInSchema = userSignUpSchema;
export type SignUpSchema = z.infer<typeof userSignUpSchema>;
export type LogInSchema = SignUpSchema;
