'use server';

import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";
import { Prisma } from "@prisma/client";
import { SubmittedCommentWithAuthorUsernameAndId, UpdateComment, UpdateCommentPayload } from '~/types';

export const updateComment: UpdateComment = async (updateCommentPayload: UpdateCommentPayload, commentId: string, userId: string,): Promise<DerailleurResponse<SubmittedCommentWithAuthorUsernameAndId>> => {
  // TODO: validateSchema and form schema creation
  const { content } = updateCommentPayload;

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
        authorId: userId
      },
      data: {
        content,
      },
      include: {
        author: {
          select: {
            username: true,
            id: true
          }
        },
      }
    });
    return (createSuccessfulResponse(updatedComment));
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying create a comment', data: { userId, updateCommentPayload, error: JSON.stringify(error) } }]);
    }
    const errResponseData = { userId, updateCommentPayload, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create comment due to prisma error', data: errResponseData }]);
  }
};