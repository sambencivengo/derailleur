'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { createSuccessfulResponse, createErrorResponse, DerailleurResponse } from '~/utils';
import { TagWithPosts } from '~/types';


export async function getTagsWithPosts(): Promise<DerailleurResponse<TagWithPosts[]>> {
  try {
    const tagsWithPosts = await prisma.tag.findMany({
      include: {
        _count: true,
        posts: {
          include: {
            tags: true
          }
        }
      },
    });
    return createSuccessfulResponse(tagsWithPosts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieving all tags with posts', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to get tags due to a prisma error', data: errResponse }]);
  }
}