'use server';

import { Prisma } from "@prisma/client";
import { GetSavedPosts, postWithAuthorNameTagsAndCommentCountQuery } from "~/types";
import { SavedPostWithPostAuthorNameTagsAndCommentCount } from "~/types/models/savedPosts";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";


export const getSavedPosts: GetSavedPosts = async (userId: string): Promise<DerailleurResponse<SavedPostWithPostAuthorNameTagsAndCommentCount[]>> => {
  try {
    const savedPosts = await prisma.userSavedPosts.findMany({
      where: {
        userId
      },
      include: {
        post: {
          include: {
            ...postWithAuthorNameTagsAndCommentCountQuery.include,
            likes: {
              where: {
                userId
              }
            },
          }

        }
      }
    });
    return createSuccessfulResponse(savedPosts);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get posts', data: { error: JSON.stringify(error) } }]);
    }
    const errResponse = { error: JSON.stringify(error), prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find post by ID due to prisma error', data: errResponse }]);
  }
};
