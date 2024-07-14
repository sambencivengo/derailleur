'use server';

import { v4 as uuid } from 'uuid';
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";
import { Prisma } from "@prisma/client";
import { CreateComment, CreateCommentPayload, SubmittedCommentWithAuthorUsernameAndId } from '~/types';

export const createComment: CreateComment = async (createCommentPayload: CreateCommentPayload, postId: string, userId: string, parentId?: string, commentId = uuid()): Promise<DerailleurResponse<SubmittedCommentWithAuthorUsernameAndId>> => {
  // TODO: validateSchema and form schema creation
  const { content } = createCommentPayload;

  try {
    const newComment = await prisma.comment.create({
      data: {
        authorId: userId,
        content,
        id: commentId,
        postId: postId,
        parentCommentId: parentId ?? null
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
    return (createSuccessfulResponse(newComment));
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying create a comment', data: { userId, createCommentPayload, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, createCommentPayload, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create comment due to prisma error', data: errResponse }]);
  }
};