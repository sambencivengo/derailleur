'use server';
import { Prisma } from "@prisma/client";
import { UserWithHashedPassword } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export async function getUserByEmailForLogin(email: string): Promise<DerailleurResponse<UserWithHashedPassword>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      },
    });
    if (!user) {
      return createErrorResponse([{ message: "Unable to find user by provided email", data: { email } }]);
    }
    return createSuccessfulResponse(user);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying find user by email', data: { email, error: JSON.stringify(error) } }]);
    }
    const errResponse = { email, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find user by email due to prisma error', data: errResponse }]);
  }
};