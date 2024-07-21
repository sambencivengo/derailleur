import { Prisma, Post as PrismaPost } from '@prisma/client';

// NOTE: Post will always have the number of comments and the username of the author included
export const postWithAuthorNameQuery = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    author: {
      select: { username: true }
    }
  }
});

export const postWithAuthorNameTagsAndCommentCountQuery = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    tags: true,
    _count: {
      select: {
        comments: true,
        likes: true
      },
    },
    savedBy: {
      select: {
        userId: true
      }
    },
    likes: {
      select: {
        userId: true
      }
    },
    author: {
      select: { username: true }
    },
  },
});

export const postWithAuthorNameAndTagsQuery = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    tags: true,
    author: {
      select: { username: true }
    }
  }
});

export interface Post extends PrismaPost { }
export type PostWithAuthorName = Prisma.PostGetPayload<typeof postWithAuthorNameQuery>;
export type PostWithAuthorNameTagsAndCommentCount = Prisma.PostGetPayload<typeof postWithAuthorNameTagsAndCommentCountQuery>;
export type PostWithAuthorNameAndTags = Prisma.PostGetPayload<typeof postWithAuthorNameAndTagsQuery>;