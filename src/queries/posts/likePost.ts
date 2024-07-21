'use server';

import { v4 as uuid } from 'uuid';
import { Prisma } from "@prisma/client";
import { LikePost } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export const likePost: LikePost = async (postId: string, userId: string, savedPostId = uuid()): Promise<DerailleurResponse<string>> => {
  try {
    await prisma.userLikedPosts.create({
      data: {
        id: savedPostId,
        postId,
        userId
      }
    });
    return createSuccessfulResponse('success');
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when liking post', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to like post due to prisma error', data: errResponse }]);
  }
};
