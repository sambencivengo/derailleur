import { Comment } from "~/types";
import { DerailleurResponse } from "~/utils";

export type CreateComment = (
  createCommentPayload: CreateCommentPayload,
  userId: string,
  commentId?: string
) => Promise<DerailleurResponse<Comment>>;

export interface CreateCommentPayload {
  postId: string;
  parentId?: string;
  content: string;
}

export type GetParentComments = (postId?: string, take?: number, cursor?: string, userId?: string) => Promise<DerailleurResponse<Comment[]>>;