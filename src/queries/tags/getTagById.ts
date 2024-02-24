'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';


// NOTE: FUNCTION IS NOT IN USE. BESPOKE TAG QUERIES ARE BEING USED INSTEAD

const tagWithCountOnly = Prisma.validator<Prisma.TagDefaultArgs>()({
  include: {
    _count: true
  }
});
type TagWithCount = Prisma.TagGetPayload<typeof tagWithCountOnly>;

const tagWithPosts = Prisma.validator<Prisma.TagDefaultArgs>()({
  include: {
    _count: true,
    posts: {
      where: {
        published: true
      },
      include: {
        author: {
          select: { username: true }
        }
      },
    }
  }
});
type TagWithPosts = Prisma.TagGetPayload<typeof tagWithPosts>;


export const getTagById: GetTagById = async (tagId: string, includePosts: boolean): Promise<DerailleurResponse<TagWithCount | TagWithPosts>> => {
  const postsQuery = includePosts ? tagWithPosts : tagWithCountOnly;

  try {
    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId
      },
      ...postsQuery
    });

    if (!tag) {
      return createErrorResponse([{ data: { tagId }, message: "Unable to find tag" }]);
    }
    return createSuccessfulResponse(tag);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to retrieve tag', data: { tagId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { tagId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
};