import prisma from "../../../prisma/prisma";
import { Post } from "../../../types/posts";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "../../utils/responseGenerators";

export interface UpdatePostPayload {
  title: string;
  content: string;
  published?: boolean;
}

export type UpdatePost = (
  updatePostPayload: UpdatePostPayload,
  userId: string,
  authorId: string
) => Promise<DerailleurResponse<Post>>;

export async function updatePost(updatePostPayload: UpdatePostPayload, postId: string, authorId: string): Promise<DerailleurResponse<Post>> {
  const { content, title, published } = updatePostPayload;
  try {
    const updatedPost = await prisma.posts.update({
      where: {
        id: postId,
        authorId: authorId
      },
      data: {
        content,
        title,
        published,
      }
    });
    return createSuccessfulResponse(updatedPost);
  } catch (error: any) {
    return createErrorResponse(error);
  }
};