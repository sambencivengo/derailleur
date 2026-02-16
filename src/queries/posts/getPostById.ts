'use server';
import { Prisma } from "@prisma/client";
import { GetPostById, PostWithAuthorNameTagsAndCommentCount, postWithAuthorNameTagsAndCommentCountQuery } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export const getPostById: GetPostById = async (postId: string, userId?: string): Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount>> => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        ...postWithAuthorNameTagsAndCommentCountQuery.include,
        savedBy: {
          where: {
            userId: { in: [userId ?? ''] }
          }
        },
        likes: {
          where: {
            userId: { in: [userId ?? ''] }
          }
        }
      }
    });

    if (!post) {
      return createErrorResponse([{ message: "Unable to find post with by provided ID", data: { userId, postId } }]);
    }
    if (userId != null && post.authorId !== userId) {
      return createErrorResponse([{ message: "Unable to find post with by provided ID", data: { userId, postId } }]);
    }
    return createSuccessfulResponse(post);

  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying find post by ID', data: { userId, postId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, postId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find post by ID due to prisma error', data: errResponse }]);
  }
};