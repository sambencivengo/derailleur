import { Prisma, UserSavedPosts } from '@prisma/client';
import { postWithAuthorNameTagsAndCommentCountQuery } from '~/types/models/posts/posts.types';


export interface SavedPost extends UserSavedPosts { }

export const savedPostWithPostAuthorNameTagsAndCommentCountQuery = Prisma.validator<Prisma.UserSavedPostsDefaultArgs>()({
  include: {
    post: {
      ...postWithAuthorNameTagsAndCommentCountQuery,
    }
  },
});

export type SavedPostWithPostAuthorNameTagsAndCommentCount = Prisma.UserSavedPostsGetPayload<typeof savedPostWithPostAuthorNameTagsAndCommentCountQuery>;
