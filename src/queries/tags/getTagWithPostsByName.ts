'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { createSuccessfulResponse, createErrorResponse } from '~/utils';
import { GetTagWithPostsByName, postWithAuthorNameTagsAndCommentCountQuery, tagWithPostsQuery } from '~/types';
import { withViewerFlags } from '~/queries/posts/utils';

export const getTagWithPostsByName: GetTagWithPostsByName = async (name, userId, cursor) => {
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        name
      },
      include: {
        ...tagWithPostsQuery.include,
        posts: {
          cursor: cursor !== undefined ? {
            id_createdAt: {
              createdAt: cursor.createdAt,
              id: cursor.postId,
            }
          } : undefined,
          take: 11, // NOTE: Show 10, if there is an 11th, show load more button and use as cursor WITHOUT skip
          // skip: cursor !== undefined ? 1 : 0,
          include: {
            ...postWithAuthorNameTagsAndCommentCountQuery.include,
            saves: { where: { userId: userId ?? '' } },
            likes: { where: { userId: userId ?? '' } },
          }
        }

      }
    });

    if (!tag) {
      return createErrorResponse([{ data: { name }, message: "Unable to find tag's posts" }]);
    }
    return createSuccessfulResponse({ ...tag, posts: tag.posts.map(withViewerFlags) });
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieve a tag', data: { name, error: JSON.stringify(error) } }]);
    }
    const errResponse = { name, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
};