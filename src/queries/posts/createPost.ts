'use server';
import { v4 as uuid } from 'uuid';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';
import { CreatePostPayload, Post } from '~/types';


export async function createPost(postPayload: CreatePostPayload, userId: string, postId = uuid()): Promise<DerailleurResponse<Post>> {
  const { content, title, published, category } = postPayload;
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