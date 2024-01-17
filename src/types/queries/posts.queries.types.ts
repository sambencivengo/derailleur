import { PostWithTags, PostWithUserName } from "~/types";
import { DerailleurResponse } from "~/utils";

export interface CreatePostPayload {
  title: string;
  content: string;
  published?: boolean;
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
  includeTags?: boolean
) => Promise<DerailleurResponse<PostWithTags>>;

export type GetPostById = (
  postId: string,
  userId: string,
  includeTags?: boolean
) => Promise<DerailleurResponse<PostWithTags>>;

export type UpdatePost = (
  updatePostPayload: UpdatePostPayload,
  userId: string,
  authorId: string,
  includeTags?: boolean
) => Promise<DerailleurResponse<PostWithTags>>;

export type GetPosts = (
  includeTags?: boolean
) => Promise<DerailleurResponse<PostWithUserName[]>>;
