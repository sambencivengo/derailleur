'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';
import { GetTagWithPostsByName, TagWithPosts, tagWithPostsQuery } from '~/types';

export const getTagWithPostsByName: GetTagWithPostsByName = async (name: string): Promise<DerailleurResponse<TagWithPosts>> => {
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        name
      },
      ...tagWithPostsQuery
    });

    if (!tag) {
      return createErrorResponse([{ data: { name }, message: "Unable to find tag" }]);
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