'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { createSuccessfulResponse, createErrorResponse, DerailleurResponse } from '~/utils';
import { GetTagWithCountByName, TagWithPostCount, tagWithPostCountQuery } from '~/types';

export const getTagWithCountByName: GetTagWithCountByName = async (name: string): Promise<DerailleurResponse<TagWithPostCount>> => {
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        name
      },
      ...tagWithPostCountQuery
    });
    if (!tag) {
      return createErrorResponse([{ data: { name }, message: "Unable to find tag" }]);
    }
    return createSuccessfulResponse(tag);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieving all tags', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to get tags due to a prisma error', data: errResponse }]);
  }
};