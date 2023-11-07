'use server';
import { Prisma } from "@prisma/client";
import { UpdatePostPayload } from "~/types";
import { Post } from "~/types/models/posts/posts.types";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "~/utils";
import prisma from "~prisma/prisma";

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