'use server';
import { v4 as uuid } from 'uuid';
import { Prisma } from '@prisma/client';
import { Post } from '~/types/posts';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';

export interface CreatePostPayload {
  title: string;
  content: string;
  published?: boolean;
}

export type CreatePost = (
  postPayload: CreatePostPayload,
  userId: string,
  postId?: string
) => Promise<DerailleurResponse<Post>>;

export async function createPost(postPayload: CreatePostPayload, userId: string, postId = uuid()): Promise<DerailleurResponse<Post>> {
  const { content, title, published } = postPayload;
  try {
    const newPost = await prisma.posts.create({
      data: {
        id: postId,
        authorId: userId,
        content,
        title,
        published
      }
    });
    return createSuccessfulResponse(newPost);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse('An error occurred when trying create a post', { userId, postPayload, error: JSON.stringify(error) });
    }
    const errResponse = { userId, postPayload, prismaErrorCode: error.code };
    return createErrorResponse('Unable to create post due to prisma error', errResponse);
  }
};