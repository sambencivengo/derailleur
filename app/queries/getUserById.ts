import prisma from "../../prisma/prisma";
import { User } from "../../types/user";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "../utils/responseGenerators";


export type GetUserById = (userId: string) => Promise<DerailleurResponse<User>>;

export async function getUserById(userId: string) {
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