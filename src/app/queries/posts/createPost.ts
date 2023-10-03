import { v4 as uuid } from 'uuid';
import prisma from "../../../../prisma/prisma";
import { Post } from "../../../../types/posts";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "../../utils/responseGenerators";

export interface CreatePostPayload {
  title: string;
  content: string;
  published?: boolean;
}

export type CreatePost = (
  postPayload: CreatePostPayload,
  userId: string,
  postId?: string
) => Promise<DerailleurResponse<Post>>;

export async function createPost(postPayload: CreatePostPayload, userId: string, postId = uuid()): Promise<DerailleurResponse<Post>> {
  const { content, title, published } = postPayload;
  try {
    const newPost = await prisma.posts.create({
      data: {
        id: postId,
        authorId: userId,
        content,
        title,
        published
      }
    });
    return createSuccessfulResponse(newPost);
  } catch (error: any) {
    return createErrorResponse(error);
  }
};