'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';
import { GetTagWithPostsById, TagWithPosts, tagWithPostsQuery } from '~/types';

export const getTagWithPostsById: GetTagWithPostsById = async (tagId: string): Promise<DerailleurResponse<TagWithPosts>> => {
  try {

    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId
      },
      ...tagWithPostsQuery
    });

    if (!tag) {
      return createErrorResponse([{ data: { tagId }, message: "Unable to find tag" }]);
    }
    return createSuccessfulResponse(tag);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieve a tag', data: { tagId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { tagId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
};