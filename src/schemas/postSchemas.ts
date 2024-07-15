import { z } from "zod";
import { CreatePostPayload } from "~/types";


export const createPostSchema: z.ZodType<CreatePostPayload> = z.object({
  title: z
    .string({
      required_error: 'Post title is required',
      invalid_type_error: 'Post title must be a string',
    })
    .min(10, {
      message: 'Post title must be at least 5 characters.',
    })
    .trim(),
  content: z
    .string({
      required_error: 'Post content is required',
      invalid_type_error: 'Post content must be a string',
    })
    .min(10, {
      message: 'Post content must be at least 10 characters.',
    })
    .trim(),
  images: z.optional(z.string().trim()),
  published: z
    .boolean({
      required_error: 'Published is required',
      invalid_type_error: 'Published must be either true or false',
    })
    .optional(),
  tags: z.array(z.string()),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;