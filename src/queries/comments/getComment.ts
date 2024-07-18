'use server';

import { Prisma } from "@prisma/client";
import { CommentWithAuthorUsernameIDAndReplies, commentWithAuthorUsernameIDAndReplies } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export const getComment = async (commentId: string, postId?: string): Promise<DerailleurResponse<{ comment: CommentWithAuthorUsernameIDAndReplies | null; }>> => {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
        postId
      },
      ...commentWithAuthorUsernameIDAndReplies,
    });
    return createSuccessfulResponse({ comment });

  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get comment and replies', data: { commentId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { commentId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to get comment and replies', data: errResponse }]);
  }
};
