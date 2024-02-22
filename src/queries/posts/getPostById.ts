'use server';
import { Prisma } from "@prisma/client";
import { Post } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export async function getPostById(postId: string, userId?: string, includeTags?: boolean): Promise<DerailleurResponse<Post>> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: userId

      },
      include: {
        author: {
          select: {
            username: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        },
        tags: includeTags
      }
    });
    if (!post) {
      return createErrorResponse([{ message: "Unable to find post with by provided ID", data: { userId, postId } }]);
    }
    return createSuccessfulResponse(post);



  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying find post by ID', data: { userId, postId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, postId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find post by ID due to prisma error', data: errResponse }]);
  }
}