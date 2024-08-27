import { z } from "zod";
import { CreatePostPayload, CreatePostSchemaFromBase, UpdatePostPayloadBase } from "~/types";

const RIDE_WITH_GPS_ROUTE_REGEX = /^https:\/\/ridewithgps\.com\/(routes|trips)\/\d+$/;

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPE = 'image/jpeg';

export const imageSchema = typeof window === 'undefined' ? z.undefined() : z.array(z.instanceof(File)).max(5, { message: 'Post cannot have more than 5 images' }).refine((files) => files.every((file) => {
  return file.size <= MAX_IMAGE_SIZE && ACCEPTED_IMAGE_TYPE === file.type;
}), { message: 'Files cannot be larger than 4MB and must be JPEGs' });

export const createPostSchema: z.ZodType<CreatePostSchemaFromBase> = z.object({
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
  }).refine((data: string) => (RIDE_WITH_GPS_ROUTE_REGEX.test(data)), { message: 'Route input must be a valid Ride With GPS route link eg: https://ridewithgps.com/routes/ or https://ridewithgps.com/trips/' }).optional().or(z.literal('')),
  images: imageSchema,
  published: z
    .boolean({
      required_error: 'Published is required',
      invalid_type_error: 'Published must be either true or false',
    })
    .optional(),
  tags: z.array(z.string()),
});

export const createPostPayloadSchema: z.ZodType<CreatePostPayload> = z.object({
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
  }).refine((data: string) => (RIDE_WITH_GPS_ROUTE_REGEX.test(data)), { message: 'Route input must be a valid Ride With GPS route link eg: https://ridewithgps.com/routes/ or https://ridewithgps.com/trips/' }).optional().or(z.literal('')),
  images: z.array(z.string()).max(5, "Cannot upload more than 5 images with your post"),
  thumbnail: z.string().optional(),
  published: z
    .boolean({
      required_error: 'Published is required',
      invalid_type_error: 'Published must be either true or false',
    })
    .optional(),
  tags: z.array(z.string()),
});

export const updatePostPayloadSchema: z.ZodType<UpdatePostPayloadBase> = z.object({
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
  }).refine((data: string) => (RIDE_WITH_GPS_ROUTE_REGEX.test(data)), { message: 'Route input must be a valid Ride With GPS route link eg: https://ridewithgps.com/routes/ or https://ridewithgps.com/trips/' }).optional().or(z.literal('')),
  published: z
    .boolean({
      required_error: 'Published is required',
      invalid_type_error: 'Published must be either true or false',
    })
    .optional(),
  tags: z.array(z.string()),
});

export type UpdatePostPayloadSchema = z.infer<typeof updatePostPayloadSchema>;
export type CreatePostPayloadSchema = z.infer<typeof createPostPayloadSchema>;
export type CreatePostSchema = z.infer<typeof createPostSchema>;