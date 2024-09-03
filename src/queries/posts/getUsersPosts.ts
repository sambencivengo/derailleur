'use server';

import { Prisma } from "@prisma/client";
import { PostWithTitleAndCommentCount } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export const getUsersPosts = async (postId: string, userId: string, limit: number = 3): Promise<DerailleurResponse<PostWithTitleAndCommentCount[]>> => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            comments: true
          }
        }
      },
      where: {
        authorId: userId,
        AND: {
          id: {
            not: postId
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });


    return createSuccessfulResponse(posts);

  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get posts', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find posts due to prisma error', data: errResponse }]);
  }
};
