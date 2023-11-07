import { Post } from "~/types";
import { DerailleurResponse } from "~/utils";

export interface CreatePostPayload {
  title: string;
  content: string;
  published?: boolean;
}

export interface UpdatePostPayload {
  title: string;
  content: string;
  published?: boolean;
}


// Query Function Types
export type CreatePost = (
  postPayload: CreatePostPayload,
  userId: string,
  postId?: string
) => Promise<DerailleurResponse<Post>>;

export type GetPostById = (postId: string, userId: string) => Promise<DerailleurResponse<Post>>;

export type UpdatePost = (
  updatePostPayload: UpdatePostPayload,
  userId: string,
  authorId: string
) => Promise<DerailleurResponse<Post>>;