'use server';

import { Prisma } from "@prisma/client";
import { Comment } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export const getComments = async (postId?: string, take: number = 10, cursor?: string, userId?: string): Promise<DerailleurResponse<Comment[]>> => {
  try {
    const comments = await prisma.comment.findMany({
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      where: {
        postId: postId,
        authorId: userId
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return createSuccessfulResponse(comments);

  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get comments', data: { userId, postId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, postId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find comments due to prisma error', data: errResponse }]);
  }
};