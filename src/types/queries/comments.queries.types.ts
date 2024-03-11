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

// NOTE: Currently getting all comments and replies
export type GetComments = (postId?: string, take?: number, cursor?: string, userId?: string) => Promise<DerailleurResponse<any[]>>;