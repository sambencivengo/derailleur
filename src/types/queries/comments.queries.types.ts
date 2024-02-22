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

