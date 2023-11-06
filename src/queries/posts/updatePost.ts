'use server';
import { Prisma } from "@prisma/client";
import { Post } from "~/types/posts";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "~/utils";
import prisma from "~prisma/prisma";

export interface UpdatePostPayload {
  title: string;
  content: string;
  published?: boolean;
}

export type UpdatePost = (
  updatePostPayload: UpdatePostPayload,
  userId: string,
  authorId: string
) => Promise<DerailleurResponse<Post>>;

export async function updatePost(updatePostPayload: UpdatePostPayload, postId: string, authorId: string): Promise<DerailleurResponse<Post>> {
  const { content, title, published } = updatePostPayload;
  try {
    const updatedPost = await prisma.posts.update({
      where: {
        id: postId,
        authorId: authorId
      },
      data: {
        content,
        title,
        published,
      }
    });
    return createSuccessfulResponse(updatedPost);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse('An error occurred when trying update a post', { userId: authorId, updatePostPayload, postId, error: JSON.stringify(error) });
    }
    const errResponse = { userId: authorId, updatePostPayload, postId, prismaErrorCode: error.code };
    return createErrorResponse('Unable to update post due to prisma error', errResponse);
  }
};