'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';

export async function getTagWithCountByName(name: string): Promise<DerailleurResponse<any>> {
  try {
    const tagWithPosts = await prisma.tag.findUnique({
      where: {
        name
      },
      include: {
        _count: true
      }
    });

    if (!tagWithPosts) {
      return createErrorResponse([{ data: { name }, message: "Unable to find tag by name" }]);
    }
    return createSuccessfulResponse(tagWithPosts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieving a tag by name', data: { name, error: JSON.stringify(error) } }]);
    }
    const errResponse = { name, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
}