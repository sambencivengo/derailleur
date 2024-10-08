'use server';
import { Prisma } from "@prisma/client";
import { userProfile, UserProfile } from "~/types/models/users";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export async function getUserByUsername(username: string): Promise<DerailleurResponse<UserProfile>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username
      },
      ...userProfile
    });
    if (!user) {
      return createErrorResponse([{ message: "Unable to find user by provided username", data: { username } }]);
    }
    return createSuccessfulResponse(user);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying find user by username', data: { username, error: JSON.stringify(error) } }]);
    }
    const errResponse = { username, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find user by username due to prisma error', data: errResponse }]);
  }
};