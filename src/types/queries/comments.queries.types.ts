import { SubmittedCommentWithAuthorUsernameAndId } from "~/types";
import { DerailleurResponse } from "~/utils";

export type CreateComment = (
  createCommentPayload: CreateCommentPayload, postId: string, userId: string, parentId?: string, commentId?: string
) => Promise<DerailleurResponse<SubmittedCommentWithAuthorUsernameAndId>>;

export type UpdateComment = (
  updateCommentPayload: UpdateCommentPayload, commentId: string, userId: string,
) => Promise<DerailleurResponse<SubmittedCommentWithAuthorUsernameAndId>>;

export interface CreateCommentPayload {
  content: string;
}
export interface UpdateCommentPayload extends CreateCommentPayload { };

// NOTE: Currently getting all comments and replies
export type GetComments = (postId?: string, take?: number, cursor?: string, userId?: string) => Promise<DerailleurResponse<any[]>>;