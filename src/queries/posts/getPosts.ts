'use server';

import { PostCategory, Prisma } from "@prisma/client";
import { GetPosts, PostWithAuthorNameTagsAndCommentCount, postWithAuthorNameTagsAndCommentCountQuery } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

interface PostCursor {
  postId: string,
  createdAt: string | Date;
}
export const getPosts: GetPosts = async (username?: string, category?: PostCategory, userId?: string, cursor?: PostCursor): Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount[]>> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      cursor: cursor !== undefined ? {
        id_createdAt: {
          createdAt: cursor.createdAt,
          id: cursor.postId,
        }
      } : undefined,
      take: 10,
      skip: cursor !== undefined ? 1 : 0,
      where: {
        author: {
          username: username
        },
        category: category ? {
          equals: category
        } : {},
      },

      include: {
        ...postWithAuthorNameTagsAndCommentCountQuery.include,
        savedBy: {
          where: {
            userId
          }
        },
        likes: {
          where: {
            userId
          }
        },
      }
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
