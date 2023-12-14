import { z } from "zod";
import { CreatePostPayload } from "~/types";


export const createPostSchema: z.ZodType<CreatePostPayload> = z.object({
  title: z
    .string({
      required_error: "Post title is required",
      invalid_type_error: "Post title must be a string",
    }).trim(),
  content: z
    .string({
      required_error: "Post content is required",
      invalid_type_error: "Post content must be a string",
    }).trim(),
  published: z
    .boolean({
      required_error: "Published is required",
      invalid_type_error: "Published must be either true or false",
    }).optional(),
  tags: z.array(z.string())
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;