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
export const tagWithPostsQuery = Prisma.validator<Prisma.TagDefaultArgs>()({
  include: {
    _count: true,
    posts: {
      include: {
        tags: true,
        author: {
          select: { username: true }
        }
      }
    }
  },
});

export interface Tag extends PrismaTag { };
export type TagWithPostCount = Prisma.TagGetPayload<typeof tagWithPostCountQuery>;
export type TagWithPosts = Prisma.TagGetPayload<typeof tagWithPostsQuery>;

