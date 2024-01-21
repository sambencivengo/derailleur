'use server';

import { Prisma } from "@prisma/client";
import { Post } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export async function getPosts(includeTags: boolean = true): Promise<DerailleurResponse<Post[]>> {
  try {
    const posts = await prisma.post.findMany({
      // TODO: create optional filters
      include: {
        author: {
          select: {
            username: true,
            id: true
          }
        },
        tags: includeTags
      },
    });
    return createSuccessfulResponse(posts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get posts', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find post by ID due to prisma error', data: errResponse }]);
  }
}
