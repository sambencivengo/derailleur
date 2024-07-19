import { Prisma, Tag as PrismaTag } from '@prisma/client';
import { postWithAuthorNameTagsAndCommentCountQuery } from '~/types/models/posts';

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
      ...postWithAuthorNameTagsAndCommentCountQuery
    }
  },
});

export interface Tag extends PrismaTag { };
export type TagWithPostCount = Prisma.TagGetPayload<typeof tagWithPostCountQuery>;
export type TagWithPosts = Prisma.TagGetPayload<typeof tagWithPostsQuery>;

