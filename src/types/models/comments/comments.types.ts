import { Prisma, Comment as PrismaComment } from '@prisma/client';

/** Default number of nested reply levels when fetching comment trees. */
export const DEFAULT_REPLY_DEPTH = 4;

const REPLIES_TAKE = 5;
const REPLIES_ORDER_BY = { createdAt: 'desc' as const };

const authorSelect = {
  select: {
    username: true,
    id: true,
  },
} as const;

/**
 * Builds the Prisma include for a comment with nested replies to a given depth.
 * Use this when you need a different depth than DEFAULT_REPLY_DEPTH (e.g. shallow threads).
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

/**
 * Fixed-depth include used for typing and default queries (DEFAULT_REPLY_DEPTH levels of replies).
 *
 */
export const commentWithAuthorUsernameIDAndReplies = Prisma.validator<Prisma.CommentDefaultArgs>()({
  include: buildCommentRepliesInclude(DEFAULT_REPLY_DEPTH) as Prisma.CommentInclude,
});

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

export type CommentWithAuthorUsernameIDAndReplies = Prisma.CommentGetPayload<typeof commentWithAuthorUsernameIDAndReplies>;
export type CommentWithUserNameAndId = Prisma.CommentGetPayload<typeof commentWithUsernameAndId>;

/**
 * Returns the same include shape as commentWithAuthorUsernameIDAndReplies but with a custom depth.
 * Use in queries when you want fewer (or more) nested reply levels than the default.
 * Type remains CommentWithAuthorUsernameIDAndReplies; runtime shape may have fewer levels.
 */
export function getCommentRepliesInclude(depth: number = DEFAULT_REPLY_DEPTH) {
  return { include: buildCommentRepliesInclude(depth) };
}

export interface Comment extends PrismaComment { }
