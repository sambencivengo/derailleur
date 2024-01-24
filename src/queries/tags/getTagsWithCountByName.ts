'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';
import { TagWithPostCount } from '~/types';

interface TagNameContainsQuery {
  name: {
    contains: string;
  };
}

export async function getTagsWithCountByName(name: string): Promise<DerailleurResponse<TagWithPostCount[]>> {
  const arrayOfNames: TagNameContainsQuery[] = name.split(" ").map((word) => {
    return (
      {
        name: {
          contains: word.toUpperCase()
        }
      }
    );
  });

  try {
    const tagsWithCount = await prisma.tag.findMany({
      where: {
        OR: [
          ...arrayOfNames,
        ]
      },
      include: {
        _count: true
      }
    });
    return createSuccessfulResponse(tagsWithCount);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieving tags by name', data: { name, error: JSON.stringify(error) } }]);
    }
    const errResponse = { name, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
}