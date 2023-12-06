'use server';

import { PostCategory, Prisma } from "@prisma/client";
import { PostWithUserName } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export async function getPosts(categories?: PostCategory[]): Promise<DerailleurResponse<PostWithUserName[]>> {
  try {
    const posts = await prisma.post.findMany({
      // TODO: create optional filters
      include: {
        author: {
          select: {
            username: true
          }
        }
      },
      where: {
        category: {
          in: categories
        }
      }
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
