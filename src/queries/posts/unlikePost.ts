'use server';

import { Prisma } from "@prisma/client";
import { UnlikePost } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export const unlikePost: UnlikePost = async (postId: string, userId: string,): Promise<DerailleurResponse<string>> => {
  try {
    const response = await prisma.userLikedPosts.deleteMany({
      where: {
        postId,
        userId
      }
    });
    return createSuccessfulResponse('success');
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to unlike post', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to unlike post due to prisma error', data: errResponse }]);
  }
};
