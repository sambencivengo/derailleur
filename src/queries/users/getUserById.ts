'use server';
import { Prisma } from "@prisma/client";
import { User } from "~/types/models/users";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export async function getUserById(userId: string): Promise<DerailleurResponse<User>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if (!user) {
      return createErrorResponse([{ message: "Unable to find user by provided ID", data: { userId } }]);
    }
    return createSuccessfulResponse(user);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying find user by ID', data: { userId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { userId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find user by ID due to prisma error', data: errResponse }]);
  }
};