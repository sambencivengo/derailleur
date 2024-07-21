'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';
import { GetTagWithPostsByName, postWithAuthorNameTagsAndCommentCountQuery, TagWithPosts, tagWithPostsQuery } from '~/types';

export const getTagWithPostsByName: GetTagWithPostsByName = async (name: string, userId?: string): Promise<DerailleurResponse<TagWithPosts>> => {
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        name
      },
      include: {
        ...tagWithPostsQuery.include,
        posts: {
          include: {
            ...postWithAuthorNameTagsAndCommentCountQuery.include,
            savedBy: {
              where: {
                userId
              }
            }
          }
        }

      }
    });

    if (!tag) {
      return createErrorResponse([{ data: { name }, message: "Unable to find tag's posts" }]);
    }
    return createSuccessfulResponse(tag);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieve a tag', data: { name, error: JSON.stringify(error) } }]);
    }
    const errResponse = { name, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
};