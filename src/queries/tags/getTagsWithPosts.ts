'use server';
import prisma from '~prisma/prisma';
import { Prisma } from '@prisma/client';
import { createSuccessfulResponse, createErrorResponse, DerailleurResponse } from '~/utils';
import { GetTagsWithPosts, TagWithPosts, tagWithPostsQuery } from '~/types';


export const getTagsWithPosts: GetTagsWithPosts = async (): Promise<DerailleurResponse<TagWithPosts[]>> => {
  try {
    const tagsWithPosts = await prisma.tag.findMany({
      ...tagWithPostsQuery
    });
    return createSuccessfulResponse(tagsWithPosts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieving all tags with posts', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to get tags due to a prisma error', data: errResponse }]);
  }
};