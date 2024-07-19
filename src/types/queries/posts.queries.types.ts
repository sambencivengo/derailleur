import { PostWithAuthorNameAndTags, PostWithAuthorNameTagsAndCommentCount } from "~/types";
import { SavedPostWithPostAuthorNameTagsAndCommentCount } from "~/types/models/savedPosts";
import { DerailleurResponse } from "~/utils";

export interface CreatePostPayload {
  title: string;
  content: string;
  published?: boolean;
  images?: string;
  route?: string;
  tags: string[];
}

export interface UpdatePostPayload {
  title: string;
  content: string;
  published?: boolean;
  images?: string;
  tags: string[];
  existingTags: { id: string, name: string; }[];
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
  postId: string,
  authorId: string,
) => Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount>>;

export type GetPosts = (username?: string) => Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount[]>>;

export type UnsavePost = (postId: string, userId: string) => Promise<DerailleurResponse<string>>;
export type SavePost = (postId: string, userId: string, savedPostId?: string) => Promise<DerailleurResponse<string>>;
export type GetSavedPost = (postId: string, userId: string) => Promise<DerailleurResponse<boolean>>;
export type GetSavedPosts = (userId: string) => Promise<DerailleurResponse<SavedPostWithPostAuthorNameTagsAndCommentCount[]>>;