'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { createSuccessfulResponse, createErrorResponse, DerailleurResponse } from '~/utils';
import { TagWithPostCount, tagWithPostCountQuery } from '~/types';

export async function getTagsWithCount(): Promise<DerailleurResponse<TagWithPostCount[]>> {
  try {
    const tagsWithCount = await prisma.tag.findMany({
      ...tagWithPostCountQuery
    });
    return createSuccessfulResponse(tagsWithCount);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieving all tags', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to get tags due to a prisma error', data: errResponse }]);
  }
}