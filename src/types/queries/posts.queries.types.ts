import { PostCategory } from "@prisma/client";
import { PostWithAuthorNameAndTags, PostWithAuthorNameTagsAndCommentCount } from "~/types";
import { SavedPostWithPostAuthorNameTagsAndCommentCount } from "~/types/models/savedPosts";
import { DerailleurResponse } from "~/utils";

export interface PostCursor {
  postId: string,
  createdAt: string | Date;
}

export interface CreatePostBase {
  title: string;
  content: string;
  published?: boolean;
  rideWithGPSLink?: string;
  tags: string[];
}

export interface CreatePostSchemaFromBase extends CreatePostBase {
  images?: Array<File>;
}
export interface CreatePostPayload extends CreatePostBase {
  images: Array<string>;
  thumbnail?: string;
}

export interface UpdatePostPayloadBase {
  title: string;
  content: string;
  published?: boolean;
  tags: string[];
  rideWithGPSLink?: string;
}
export interface UpdatePostPayload extends UpdatePostPayloadBase {
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

export enum OrderBy { DESC = 'desc', ASC = 'asc' };
export type GetPosts = (username?: string, category?: PostCategory, userId?: string, cursor?: PostCursor, likeOrder?: OrderBy, createdAtOrder?: OrderBy, createdAtCursor?: Date, initialQueryDateWindow?: number) => Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount[]>>;

export type UnsavePost = (postId: string, userId: string) => Promise<DerailleurResponse<string>>;
export type SavePost = (postId: string, userId: string, savedPostId?: string) => Promise<DerailleurResponse<string>>;
export type UnlikePost = (postId: string, userId: string) => Promise<DerailleurResponse<string>>;
export type LikePost = (postId: string, userId: string, savedPostId?: string) => Promise<DerailleurResponse<string>>;
export type GetSavedPost = (postId: string, userId: string) => Promise<DerailleurResponse<boolean>>;
export type GetSavedPosts = (userId: string) => Promise<DerailleurResponse<SavedPostWithPostAuthorNameTagsAndCommentCount[]>>;