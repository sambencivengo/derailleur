import { Prisma, Tag as PrismaTag } from '@prisma/client';

export const tagWithPostCountQuery = Prisma.validator<Prisma.TagDefaultArgs>()({
  include: {
    _count: {
      select: {
        posts: true
      }
    },
  }
});

export interface Tag extends PrismaTag { }
export type TagWithPostCount = Prisma.TagGetPayload<typeof tagWithPostCountQuery>;