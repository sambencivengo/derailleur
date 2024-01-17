'use server';
import { v4 as uuid } from 'uuid';
import { Prisma } from '@prisma/client';
import prisma from '~prisma/prisma';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse, DerailleurError } from '~/utils';
import { CreatePostPayload, PostWithTags } from '~/types';
import { CreatePostSchema, createPostSchema, validateSchema } from '~/schemas';
import { PrismaQueryErrorCodes } from '~prisma/prismaErrorCodes';

// NOTE: function is currently recursive so that tags don't collide if created at the exact same time.
// Refactor to check which attempt and stop after 5,5 etc...
export async function createPost(postPayload: CreatePostPayload, userId: string, postId = uuid(), includeTags: boolean = true): Promise<DerailleurResponse<PostWithTags>> {

  const validateResponse = validateSchema<CreatePostSchema>({ body: postPayload, schema: createPostSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    const errors: DerailleurError[] = validateResponse.errors.map((error) => {
      return { data: postPayload, message: error.message };
    });
    return (createErrorResponse(errors));
  }
  const { content, title, tags } = validateResponse.result;
  try {
    const newPost = await prisma.post.create({
      data: {
        id: postId,
        authorId: userId,
        content,
        title,
        published: true, // NOTE: CHANGE WHEN USING PUBLISHED ARGS AND DRAFTS
        tags: {
          connectOrCreate: tags.map((tagName) => {
            return {
              where: { name: tagName },
              create: { name: tagName },
            };
          }),
        }
      },
      include: {
        tags: includeTags
      }
    });
    return createSuccessfulResponse(newPost);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying create a post', data: { userId, postPayload, error: JSON.stringify(error) } }]);
    };
    const errorTarget = error.meta?.target as unknown as string[];

    if (error.code == PrismaQueryErrorCodes.UNIQUE_CONSTRAINT && errorTarget[0] === 'name') {
      console.warn("Recursive createPost call required due to Tag name collision");
      await createPost(postPayload, userId, postId, includeTags);
    }
    const errResponse = { userId, postPayload, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to create post due to prisma error', data: errResponse }]);
  }
}