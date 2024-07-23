import { z } from "zod";
import { CreatePostPayload } from "~/types";

const RIDE_WITH_GPS_ROUTE_REGEX = /^https:\/\/ridewithgps\.com\/(routes|trips)\/\d+$/;

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
  rideWithGPSLink: z.string({
    invalid_type_error: 'Post content must be a string',
  }).refine((data: string) => (RIDE_WITH_GPS_ROUTE_REGEX.test(data)), { message: 'Route input must be a valid Ride With GPS route link eg: https://ridewithgps.com/routes/ or https://ridewithgps.com/trips/' }).optional(),
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