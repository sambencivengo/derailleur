import { Prisma, Comment as PrismaComment } from '@prisma/client';

/** Default number of nested reply levels when fetching comment trees. */
export const DEFAULT_REPLY_DEPTH = 4;

const REPLIES_TAKE = 5;
const REPLIES_ORDER_BY = { createdAt: 'desc' } as const;

const authorSelect = {
  select: {
    username: true,
    id: true,
  },
} as const;

/**
 * Static literal include so Prisma infers a single recursive type from the validator.
 * No function-built include here: the validator must see a literal for GetPayload to infer correctly.
 */
export const commentWithAuthorUsernameIDAndReplies = Prisma.validator<Prisma.CommentDefaultArgs>()({
  include: {
    author: authorSelect,
    _count: true,
    replies: {
      take: REPLIES_TAKE,
      orderBy: REPLIES_ORDER_BY,
      include: {
        author: authorSelect,
        _count: true,
        replies: {
          take: REPLIES_TAKE,
          orderBy: REPLIES_ORDER_BY,
          include: {
            author: authorSelect,
            _count: true,
            replies: {
              take: REPLIES_TAKE,
              orderBy: REPLIES_ORDER_BY,
              include: {
                author: authorSelect,
                _count: true,
                replies: {
                  take: REPLIES_TAKE,
                  orderBy: REPLIES_ORDER_BY,
                  include: {
                    author: authorSelect,
                    _count: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

/** Inferred from the validator; no cast at the query boundary. */
export type CommentWithAuthorUsernameIDAndReplies = Prisma.CommentGetPayload<typeof commentWithAuthorUsernameIDAndReplies>;

export const commentWithUsernameAndId = Prisma.validator<Prisma.CommentDefaultArgs>()({
  include: {
    author: {
      select: {
        username: true,
        id: true,
      },
    },
  },
});

export type CommentWithUserNameAndId = Prisma.CommentGetPayload<typeof commentWithUsernameAndId>;

/**
 * Builds the Prisma include for a custom reply depth (e.g. shallow threads).
 * Use getCommentRepliesInclude(depth) only when you need non-default depth; the return type
 * is not inferred recursively, so prefer the default commentWithAuthorUsernameIDAndReplies for typing.
 */
function buildCommentRepliesInclude(depth: number): Prisma.CommentInclude {
  const levelInclude: Prisma.CommentInclude = {
    author: authorSelect,
    _count: true,
  };

  if (depth > 0) {
    (levelInclude as Record<string, unknown>).replies = {
      take: REPLIES_TAKE,
      orderBy: REPLIES_ORDER_BY,
      include: buildCommentRepliesInclude(depth - 1),
    };
  }

  return levelInclude;
}

export function getCommentRepliesInclude(depth: number = DEFAULT_REPLY_DEPTH) {
  return { include: buildCommentRepliesInclude(depth) };
}

export interface Comment extends PrismaComment { }
