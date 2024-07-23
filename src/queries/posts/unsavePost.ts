'use server';

import { Prisma } from "@prisma/client";
import { UnsavePost } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export const unsavePost: UnsavePost = async (postId: string, userId: string,): Promise<DerailleurResponse<string>> => {
  try {
    await prisma.userSavedPosts.deleteMany({
      where: {
        postId,
        userId
      }
    });
    return createSuccessfulResponse('success');
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to unsave post', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to unsave post due to prisma error', data: errResponse }]);
  }
};
