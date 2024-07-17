'use server';

import { Prisma } from "@prisma/client";
import { GetSavedPost } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export const getSavedPost: GetSavedPost = async (postId: string, userId: string): Promise<DerailleurResponse<boolean>> => {
  try {
    const savedPost = await prisma.userSavedPosts.findFirst({
      where: {
        postId,
        userId
      }
    });
    if (savedPost === null) {
      return createSuccessfulResponse(false);
    }
    else {
      return createSuccessfulResponse(true);
    }
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get posts', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find post by ID due to prisma error', data: errResponse }]);
  }
};
