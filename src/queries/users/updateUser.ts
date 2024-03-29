'use server';
import { Prisma } from "@prisma/client";
import { UpdateUserPayload, User } from "~/types";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "~/utils";
import prisma from "~prisma/prisma";

export async function updateUser(user: UpdateUserPayload, userId: string,): Promise<DerailleurResponse<User>> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...user
      },
    });
    return (createSuccessfulResponse(updatedUser));
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when attempting to update a user', data: { user, userId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to update user due to prisma error', data: errResponse }]);
  }
}