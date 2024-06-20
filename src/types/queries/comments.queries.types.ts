import { Comment } from "~/types";
import { DerailleurResponse } from "~/utils";

export type CreateComment = (
  createCommentPayload: CreateCommentPayload, postId: string, userId: string, parentId?: string, commentId?: string
) => Promise<DerailleurResponse<Comment>>;

export interface CreateCommentPayload {
  content: string;
}

// NOTE: Currently getting all comments and replies
export type GetComments = (postId?: string, take?: number, cursor?: string, userId?: string) => Promise<DerailleurResponse<any[]>>;