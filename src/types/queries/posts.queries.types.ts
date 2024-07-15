import { PostWithAuthorNameAndTags, PostWithAuthorNameTagsAndCommentCount } from "~/types";
import { DerailleurResponse } from "~/utils";

export interface CreatePostPayload {
  title: string;
  content: string;
  published?: boolean;
  images?: string;
  tags: string[];
}

export interface UpdatePostPayload {
  title: string;
  content: string;
  published?: boolean;
  tags: string[];
}

// Query Function Types
export type CreatePost = (
  postPayload: CreatePostPayload,
  userId: string,
  postId?: string,
  attemptsLeft?: number
) => Promise<DerailleurResponse<PostWithAuthorNameAndTags>>;

export type GetPostById = (
  postId: string,
  userId?: string,
) => Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount>>;

export type UpdatePost = (
  updatePostPayload: UpdatePostPayload,
  userId: string,
  authorId: string,
) => Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount>>;

export type GetPosts = () => Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount[]>>;
