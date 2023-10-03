import prisma from "../../../../prisma/prisma";
import { Post } from "../../../../types/posts";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "../../utils/responseGenerators";


export type GetPostById = (postId: string, userId: string) => Promise<DerailleurResponse<Post>>;
export async function getPostById(postId: string, userId: string): Promise<DerailleurResponse<Post>> {
  try {
    const post = await prisma.posts.findUnique({
      where: {
        id: postId,
        authorId: userId
      }
    });
    if (!post) {
      const error = "Unable to find user by id";
      return createErrorResponse(error);
    } else {
      return createSuccessfulResponse(post);
    }
  } catch (error: any) {
    return createErrorResponse(error);
  }
}