'use server';
import { Prisma } from "@prisma/client";
import { UserWithHashedPassword } from "~/types/models/users";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

// TODO: conditionally return password hash
export async function getUserByUsername(username: string): Promise<DerailleurResponse<UserWithHashedPassword>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username
      }
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