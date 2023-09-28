import prisma from "../../../prisma/prisma";
import { User } from "../../../types/users";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "../../utils/responseGenerators";
import { CreateUser } from "./createUser";

export type UpdateUser = Partial<CreateUser>;

export async function updateUser(userId: string, user: UpdateUser): Promise<DerailleurResponse<User>> {
  try {
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        ...user
      },
    });
    return (createSuccessfulResponse(updatedUser));
  } catch (error: any) {
    return (createErrorResponse(error));
  }
}