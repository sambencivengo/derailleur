'use server';
import { v4 as uuid } from 'uuid';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse, DerailleurError } from '~/utils';
import { CreatePostPayload, Post } from '~/types';
import { CreatePostSchema, createPostSchema, validateSchema } from '~/schemas';


export async function createPost(postPayload: CreatePostPayload, userId: string, postId = uuid()): Promise<DerailleurResponse<Post>> {

  const validateResponse = validateSchema<CreatePostSchema>({ body: postPayload, schema: createPostSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    const errors: DerailleurError[] = validateResponse.errors.map((error) => {
      return { data: postPayload, message: error.message };
    });
    return (createErrorResponse(errors));
  }
  const { content, title, category, published } = validateResponse.result;

  try {
    const newPost = await prisma.post.create({
      data: {
        id: postId,
        authorId: userId,
        content,
        title,
        published,
        category
      },
    });
    return createSuccessfulResponse(newPost);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying create a post', data: { userId, postPayload, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, postPayload, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
}