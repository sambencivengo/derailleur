'use server';

import { PostCategory, Prisma } from "@prisma/client";
import { GetPosts, OrderBy, PostCursor, PostWithAuthorNameTagsAndCommentCount, postWithAuthorNameTagsAndCommentCountQuery } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export const getPosts: GetPosts = async (username?: string, category?: PostCategory, userId?: string, cursor?: PostCursor): Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount[]>> => {
  const gravity = 1.8; // scoring algorithm
  try {
    console.log({ cursor });
    const posts = await prisma.post.findMany({
      orderBy: [
        {
          likes: { _count: OrderBy.DESC }
        },
        {
          createdAt: OrderBy.DESC
        }
      ],
      cursor: cursor !== undefined ? {
        id_createdAt: {
          createdAt: cursor.createdAt,
          id: cursor.postId,
        }
      } : undefined,
      take: 11, // NOTE: Show 10, if there is an 11th, show load more button and use as cursor WITHOUT skip
      // skip: cursor !== undefined ? 1 : 0,
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
            userId: { in: [userId ?? ''] }
          }
        },
        likes: {
          where: {
            userId: { in: [userId ?? ''] }
          }
        }
      }
    });

    // Scoring algorithm
    const now = new Date();
    const rankedPosts = posts.map(post => {
      const hoursSincePost = (now.getTime() - new Date(post.createdAt).getTime()) / 36e5;
      const score = post.likes.length / Math.pow((hoursSincePost + 2), gravity);
      return { ...post, score };
    }).sort((a, b) => b.score - a.score);


    return createSuccessfulResponse(rankedPosts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get posts', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find post by ID due to prisma error', data: errResponse }]);
  }
};
