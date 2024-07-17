'use server';

import { v4 as uuid } from 'uuid';
import { Prisma } from "@prisma/client";
import { SavePost } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export const savePost: SavePost = async (postId: string, userId: string, savedPostId = uuid()): Promise<DerailleurResponse<string>> => {
  try {
    await prisma.userSavedPosts.create({
      data: {
        id: savedPostId,
        postId,
        userId
      }
    });
    return createSuccessfulResponse('success');
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when save post', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find save post due to prisma error', data: errResponse }]);
  }
};
