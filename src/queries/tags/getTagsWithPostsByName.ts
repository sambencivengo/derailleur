'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';
import { GetTagsWithPostsByName, TagWithPosts, tagWithPostsQuery } from '~/types';

interface TagNameContainsQuery {
  name: {
    contains: string;
  };
}

export const getTagsWithPostsByName: GetTagsWithPostsByName = async (name: string): Promise<DerailleurResponse<TagWithPosts[]>> => {
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
    const tagsWithPosts = await prisma.tag.findMany({
      where: {
        OR: [
          ...arrayOfNames,
        ]
      },
      ...tagWithPostsQuery
    });

    return createSuccessfulResponse(tagsWithPosts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when retrieving tags by name', data: { name, error: JSON.stringify(error) } }]);
    }
    const errResponse = { name, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
};