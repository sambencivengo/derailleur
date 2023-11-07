'use server';
import { Prisma } from "@prisma/client";
import { Post } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export async function getPostById(postId: string, userId: string): Promise<DerailleurResponse<Post>> {
  try {
    const post = await prisma.posts.findUnique({
      where: {
        id: postId,
        authorId: userId
      }
    });
    if (!post) {
      return createErrorResponse("Unable to find post with by provided ID", { userId, postId });
    }
    return createSuccessfulResponse(post);



  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse('An error occurred when trying find post by ID', { userId, postId, error: JSON.stringify(error) });
    }
    const errResponse = { userId, postId, prismaErrorCode: error.code };
    return createErrorResponse('Unable to find post by ID due to prisma error', errResponse);
  }
}