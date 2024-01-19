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

export async function getTagWithCountByName(name: string): Promise<DerailleurResponse<TagWithPostCount[]>> {
  const arrayOfNames: TagNameContainsQuery[] = name.split(" ").map((word) => {
    return (
      {
        name: {
          contains: word
        }
      }
    );
  });

  try {
    const tagWithPosts = await prisma.tag.findMany({
      where: {
        OR: [
          ...arrayOfNames,
        ]
      },
      include: {
        _count: true
      }
    });

    if (!tagWithPosts) {
      return createErrorResponse([{ data: { name }, message: "Unable to find tags by name" }]);
    }
    return createSuccessfulResponse(tagWithPosts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieving tags by name', data: { name, error: JSON.stringify(error) } }]);
    }
    const errResponse = { name, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
}