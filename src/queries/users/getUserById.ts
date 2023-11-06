import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/prisma";
import { User } from "../../types/users";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "../../utils/responseGenerators";


export type GetUserById = (userId: string) => Promise<DerailleurResponse<User>>;

export async function getUserById(userId: string): Promise<DerailleurResponse<User>> {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId
      }
    });
    if (!user) {
      return createErrorResponse("Unable to find user by provided ID", { userId });
    }
    return createSuccessfulResponse(user);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse('An error occurred when trying find user by ID', { userId, error: JSON.stringify(error) });
    }
    const errResponse = { userId, prismaErrorCode: error.code };
    return createErrorResponse('Unable to find user by ID due to prisma error', errResponse);
  }
};