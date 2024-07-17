'use server';
import { v4 as uuid } from 'uuid';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse, DerailleurError } from '~/utils';
import { CreatePost, CreatePostPayload, PostWithAuthorNameAndTags, postWithAuthorNameAndTagsQuery } from '~/types';
import { CreatePostSchema, createPostSchema, validateSchema } from '~/schemas';
import { PrismaQueryErrorCodes } from '~prisma/prismaErrorCodes';

// NOTE: function is currently recursive so that tags don't collide if created at the exact same time.
// Refactor to check which attempt and stop after 3,5 etc...

export const createPost: CreatePost = async (postPayload: CreatePostPayload, userId: string, postId = uuid(), attemptsLeft: number = 3): Promise<DerailleurResponse<PostWithAuthorNameAndTags>> => {

  if (attemptsLeft < 1) {
    return (createErrorResponse([{ data: { postPayload, userId, postId }, message: "Create Post recursive attempts exhausted" }]));
  }
  else {
    const validateResponse = validateSchema<CreatePostSchema>({ body: postPayload, schema: createPostSchema });
    if (validateResponse.result === null || validateResponse.errors.length > 0) {
      const errors: DerailleurError[] = validateResponse.errors.map((error) => {
        return { data: postPayload, message: error.message };
      });
      return (createErrorResponse(errors));
    }
    const { content, title, tags, images } = validateResponse.result;
    try {
      const newPost = await prisma.post.create({
        data: {
          id: postId,
          images: images !== undefined ? images.split(',').map((image => image)) : [],
          authorId: userId,
          content,
          title,
          published: true, // NOTE: CHANGE WHEN USING PUBLISHED ARGS AND DRAFTS
          tags: {
            connectOrCreate: tags.map((tagName) => {
              const upperCaseTagName = tagName.toUpperCase();
              return {
                where: { name: upperCaseTagName },
                create: { name: upperCaseTagName },
              };
            }),
          },
        },
        ...postWithAuthorNameAndTagsQuery
      });
      return createSuccessfulResponse(newPost);

    } catch (error: any) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        return createErrorResponse([{ message: 'An error occurred when trying create a post', data: { userId, postPayload, error: JSON.stringify(error) } }]);
      }

      const errorTarget = error.meta?.target as unknown as string[];
      if (error.code == PrismaQueryErrorCodes.UNIQUE_CONSTRAINT && errorTarget[0] === 'name') {
        console.warn(`Recursive createPost call required due to Tag name collision, attempts left: ${attemptsLeft}`);
        await createPost(postPayload, userId, postId, attemptsLeft - 1);
      }

      const errResponse = { userId, postPayload, prismaErrorCode: error.code };
      return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
    }
  }
};