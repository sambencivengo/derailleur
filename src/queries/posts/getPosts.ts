'use server';

import { Prisma } from "@prisma/client";
import { GetPosts, OrderBy, postWithAuthorNameTagsAndCommentCountQuery } from "~/types";
import { createErrorResponse, createSuccessfulResponse } from "~/utils";
import { withViewerFlags } from "~/queries/posts/utils";
import prisma from "~prisma/prisma";


export const getPosts: GetPosts = async (username, category, userId, cursor, sort = 'best') => {
  const gravity = 1.8; // scoring algorithm
  try {
    const posts = await prisma.post.findMany({
      orderBy: sort === 'best' ? [
        {
          likes: { _count: OrderBy.DESC }
        },
        { createdAt: OrderBy.DESC }
      ] : [{ createdAt: OrderBy.DESC }],
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
        saves: {
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

    const postsWithFlags = posts.map(withViewerFlags);

    if (sort === 'best') {
      // Scoring algorithm (uses _count.likes — total likes, not viewer-filtered)
      const now = new Date();
      const rankedPosts = [...postsWithFlags].sort((a, b) => {
        const hoursA = (now.getTime() - new Date(a.createdAt).getTime()) / 36e5;
        const hoursB = (now.getTime() - new Date(b.createdAt).getTime()) / 36e5;
        const scoreA = a._count.likes / Math.pow((hoursA + 2), gravity);
        const scoreB = b._count.likes / Math.pow((hoursB + 2), gravity);
        return scoreB - scoreA;
      });
      return createSuccessfulResponse(rankedPosts);
    }

    return createSuccessfulResponse(postsWithFlags);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get posts', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find post by ID due to prisma error', data: errResponse }]);
  }
};
