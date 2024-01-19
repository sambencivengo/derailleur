'use server';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from '~/utils';
import { TagWithPostCount } from '~/types';


const tagWithCountOnly = Prisma.validator<Prisma.TagDefaultArgs>()({
  include: {
    _count: true
  }
});
// type TagWithCount = Prisma.TagGetPayload<typeof tagWithCountOnly>;


export async function getTagWithCountById(tagId: string): Promise<DerailleurResponse<TagWithPostCount>> {
  try {
    const tag: TagWithPostCount | null = await prisma.tag.findUnique({
      where: {
        id: tagId
      },
      ...tagWithCountOnly
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
}