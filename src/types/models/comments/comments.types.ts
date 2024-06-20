import { Prisma, Comment as PrismaComment } from '@prisma/client';

export const commentWithAuthorUsernameIDAndReplies = Prisma.validator<Prisma.CommentDefaultArgs>()({
  include: {
    author: {
      select: {
        username: true,
        id: true
      }
    },
    _count: true,
    // first level of children
    replies: {
      include: {
        author: {
          select: {
            username: true,
            id: true
          }
        },
        _count: true,
        // second level of children
        replies: {
          include: {
            author: {
              select: {
                username: true,
                id: true
              }
            },
            _count: true,
            // third level of children
            replies: {
              include: {
                author: {
                  select: {
                    username: true,
                    id: true
                  }
                },
                // fourth third level of children
                _count: true,
                replies: {
                  include: {
                    author: {
                      select: {
                        username: true,
                        id: true
                      }
                    },
                    _count: true,
                  },
                }
              },
            }
          }
        },
      }
    }
  }
});


export type CommentWithAuthorUsernameIDAndReplies = Prisma.PostGetPayload<typeof commentWithAuthorUsernameIDAndReplies>;

export interface Comment extends PrismaComment { }
