import { z } from "zod";
import { CreatePostPayload } from "~/types";

const RIDE_WITH_GPS_ROUTE_REGEX = /^https:\/\/ridewithgps\.com\/routes\/\d+$/;

export const createPostSchema: z.ZodType<CreatePostPayload> = z.object({
  title: z
    .string({
      required_error: 'Post title is required',
      invalid_type_error: 'Post title must be a string',
    })
    .min(5, {
      message: 'Post title must be at least 5 characters.',
    }).max(130, {
      message: 'Post title cannot be more than 130 characters.',
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
  route: z.string({
    invalid_type_error: 'Post content must be a string',
  }).refine((data: string) => (RIDE_WITH_GPS_ROUTE_REGEX.test(data)), { message: 'Route input must be a valid Ride With GPS route link eg: https://ridewithgps.com/routes/38157234' }).optional(),
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