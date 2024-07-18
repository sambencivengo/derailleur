'use server';

import { Prisma } from "@prisma/client";
import { GetPosts, PostWithAuthorNameTagsAndCommentCount, postWithAuthorNameTagsAndCommentCountQuery } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export const getPosts: GetPosts = async (username?: string): Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount[]>> => {
  try {
    const posts = await prisma.post.findMany({
      ...postWithAuthorNameTagsAndCommentCountQuery,
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        author: {
          username: username
        }
      },
    });
    return createSuccessfulResponse(posts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get posts', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find post by ID due to prisma error', data: errResponse }]);
  }
};
