'use server';

import { Prisma } from "@prisma/client";
import { CommentWithAuthorUsernameIDAndReplies, commentWithAuthorUsernameIDAndReplies, commentWithUsernameAndId, CommentWithUserNameAndId } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export interface CommentCursor {
  commentId: string,
  createdAt: string | Date;
}
export const getComments = async (postId?: string, parentCommentId?: string, username?: string, cursor?: CommentCursor): Promise<DerailleurResponse<CommentWithAuthorUsernameIDAndReplies[]>> => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentCommentId: parentCommentId ?? null,
        author: {
          username
        }
      },
      cursor: cursor !== undefined ? {
        id_createdAt: {
          createdAt: cursor.createdAt,
          id: cursor.commentId,
        }
      } : undefined,
      take: 6, // NOTE: Show 10, if there is an 11th, show load more button and use as cursor WITHOUT skip
      // skip: cursor !== undefined ? 1 : 0,
      ...commentWithAuthorUsernameIDAndReplies,
    });
    return createSuccessfulResponse(comments);

  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get comments', data: { postId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { postId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find comments due to prisma error', data: errResponse }]);
  }
};

export const getCommentsForProfile = async (
  username: string
): Promise<DerailleurResponse<CommentWithUserNameAndId[]>> => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        author: {
          username
        }
      },
      ...commentWithUsernameAndId,
    });
    return createSuccessfulResponse(comments);

  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get comments', data: { username, error: JSON.stringify(error) } }]);
    }
    const errResponse = { username, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find comments due to prisma error', data: errResponse }]);
  }
};