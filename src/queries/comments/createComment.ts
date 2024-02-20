'use server';

import { v4 as uuid } from 'uuid';
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";
import { Prisma } from "@prisma/client";


// NOTE: DO i need bespoke functions for comment replies vs. og comments on a post
interface CreateCommentPayload {
  postId: string;
  parentId?: string;
  content: string;
}

// TODO: finish typing
// TODO: extract types to file
export async function createComment(createCommentPayload: CreateCommentPayload, userId: string, commentId = uuid()): Promise<DerailleurResponse<any>> {

  // NOTE: Possibly redundant, will fail to create comment if post doesn't exist
  // const existingPost = await getPostById();


  // TODO: validateSchema and form schema creation

  const { content, postId, parentId } = createCommentPayload;
  try {
    if (parentId) {
      // comment is a reply
      const reply = await prisma.comment.createMany({
        data: {
          authorId: userId,
          content,
          id: commentId,
          postId: postId,
          parentCommentId: parentId
        }
      });
      return (createSuccessfulResponse(reply));
    } else {
      // comment is a parent and directly on the post
      const newComment = await prisma.comment.createMany({
        data: {
          authorId: userId,
          content,
          id: commentId,
          postId: postId,
        }
      });
      return (createSuccessfulResponse(newComment));
    }
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying create a comment', data: { userId, createCommentPayload, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, createCommentPayload, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
}