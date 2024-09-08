'use server';
import { Prisma } from "@prisma/client";
import { editProfileSchema, EditProfileSchema, validateSchema } from "~/schemas";
import { UpdateUserPayload, UserProfile, userProfile } from "~/types";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse, DerailleurError } from "~/utils";
import prisma from "~prisma/prisma";

export async function updateUser(updateUserPayload: UpdateUserPayload, userId: string,): Promise<DerailleurResponse<UserProfile>> {
  try {
    const validateResponse = validateSchema<EditProfileSchema>({ body: updateUserPayload, schema: editProfileSchema });
    if (validateResponse.result === null || validateResponse.errors.length > 0) {
      const errors: DerailleurError[] = validateResponse.errors.map((error) => {
        return { data: updateUserPayload, message: error.message };
      });
      return (createErrorResponse(errors));
    }
    const { favoriteBikes, location } = validateResponse.result;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        location: location === '' ? null : updateUserPayload.location,
        favoriteBikes
      },
      ...userProfile
    });
    return (createSuccessfulResponse(updatedUser));
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when attempting to update a user', data: { user: updateUserPayload, userId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to update user due to prisma error', data: errResponse }]);
  }
}