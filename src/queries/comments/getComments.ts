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
      orderBy: {
        createdAt: 'desc'
      },
      cursor: cursor !== undefined ? {
        id_createdAt: {
          createdAt: cursor.createdAt,
          id: cursor.commentId,
        }
      } : undefined,
      take: cursor === undefined ? 10 : 5,
      skip: cursor === undefined ? 0 : 1,
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