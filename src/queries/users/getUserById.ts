import prisma from "../../../prisma/prisma";
import { User } from "../../types/users";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "../../app/utils/responseGenerators";


export type GetUserById = (userId: string) => Promise<DerailleurResponse<User>>;

export async function getUserById(userId: string): Promise<DerailleurResponse<User>> {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId
      }
    });
    if (!user) {
      // TODO: Create a standard error format that includes data like userId
      const error = "Unable to find user by id";
      return createErrorResponse(error);
    } else {
      return createSuccessfulResponse(user);
    }
  } catch (error: any) {
    return createErrorResponse(error);
  }
};