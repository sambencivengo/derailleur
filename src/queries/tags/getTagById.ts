'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';
import { TagWithPosts } from '~/types';

export async function getTagById(tagId: string): Promise<DerailleurResponse<TagWithPosts>> {
  try {
    const tagWithPosts = await prisma.tag.findUnique({
      where: {
        id: tagId
      },
      include: {
        posts: {
          where: {
            published: true
          }
        }
      }
    });

    if (!tagWithPosts) {
      return createErrorResponse([{ data: { tagId }, message: "Unable to find tag" }]);
    }
    return createSuccessfulResponse(tagWithPosts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieve a tag', data: { tagId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { tagId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
}