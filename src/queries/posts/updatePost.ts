'use server';
import { Prisma } from "@prisma/client";
import { determinePostCategory } from "~/queries/posts/utils";
import { PostWithAuthorNameTagsAndCommentCount, UpdatePost, UpdatePostPayload, postWithAuthorNameTagsAndCommentCountQuery } from "~/types";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "~/utils";
import prisma from "~prisma/prisma";

export const updatePost: UpdatePost = async (updatePostPayload: UpdatePostPayload, postId: string, authorId: string): Promise<DerailleurResponse<PostWithAuthorNameTagsAndCommentCount>> => {
  const { content, title, published, tags, rideWithGPSLink, existingTags } = updatePostPayload;

  const tagsToDelete: Array<{ name: string, id: string; }> = [];
  for (let i = 0; i < existingTags.length; i++) {
    const existingTag = existingTags[i];
    if (!tags.includes(existingTag.name)) {
      tagsToDelete.push(existingTag);
    }
  }
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
        authorId: authorId
      },
      data: {
        content,
        title,
        category: determinePostCategory(rideWithGPSLink),
        rideWithGPSLink: rideWithGPSLink === '' ? null : rideWithGPSLink,
        published,
        tags:
        {
          disconnect: existingTags.map(({ id }) => {
            return { id };
          }),
          connectOrCreate: tags.map((tagName) => {
            const upperCaseTagName = tagName.toUpperCase();
            return {
              where: { name: upperCaseTagName },
              create: { name: upperCaseTagName },
            };
          }),
        },
      },
      ...postWithAuthorNameTagsAndCommentCountQuery
    });
    return createSuccessfulResponse(updatedPost);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying update a post', data: { userId: authorId, updatePostPayload, postId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId: authorId, updatePostPayload, postId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to update post due to prisma error', data: errResponse }]);
  }
};