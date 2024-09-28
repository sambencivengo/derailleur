'use server';
import { Prisma } from "@prisma/client";
import { UserWithHashedPassword } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export async function getUserByUsernameOrEmailForLogin(usernameOrEmail: string): Promise<DerailleurResponse<UserWithHashedPassword>> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: { equals: usernameOrEmail }
          },
          {
            username: { equals: usernameOrEmail }
          }
        ]
      },
    });
    if (!user) {
      return createErrorResponse([{ message: "Unable to find user by provided username or email", data: { usernameOrEmail } }]);
    }
    return createSuccessfulResponse(user);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying find user by username or email', data: { usernameOrEmail, error: JSON.stringify(error) } }]);
    }
    const errResponse = { usernameOrEmail, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find user by username or email due to prisma error', data: errResponse }]);
  }
};