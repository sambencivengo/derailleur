'use server';
import { Prisma } from "@prisma/client";
import { GetPostById, postWithAuthorNameTagsAndCommentCountQuery } from "~/types";
import { createErrorResponse, createSuccessfulResponse } from "~/utils";
import { withViewerFlags } from "~/queries/posts/utils";
import prisma from "~prisma/prisma";

export const getPostById: GetPostById = async (postId, userId) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        ...postWithAuthorNameTagsAndCommentCountQuery.include,
        saves: {
          where: {
            userId: userId ?? ''
          }
        },
        likes: {
          where: {
            userId: userId ?? ''
          }
        }
      }
    });

    if (!post) {
      return createErrorResponse([{ message: "Unable to find post", data: { userId, postId } }]);
    }

    return createSuccessfulResponse(withViewerFlags(post));

  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying find post by ID', data: { userId, postId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, postId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find post by ID due to prisma error', data: errResponse }]);
  }
};
