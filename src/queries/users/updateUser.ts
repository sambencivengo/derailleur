import { Prisma } from "@prisma/client";
import { CreateUserPayload } from "~/queries/users/createUser";
import { User } from "~/types/users";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "~/utils";
import prisma from "~prisma/prisma";

export type UpdateUserPayload = Omit<Partial<CreateUserPayload>, 'password'>;

export type UpdateUser = (user: UpdateUserPayload, userId: string) => Promise<DerailleurResponse<User>>;

export async function updateUser(user: UpdateUserPayload, userId: string,): Promise<DerailleurResponse<User>> {
  try {
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        ...user
      },
    });
    return (createSuccessfulResponse(updatedUser));
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse('An error occurred when attempting to update a user', { user, userId, error: JSON.stringify(error) });
    }
    const errResponse = { userId, prismaErrorCode: error.code };
    return createErrorResponse('Unable to update user due to prisma error', errResponse);
  }
}