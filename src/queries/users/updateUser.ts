import prisma from "../../../prisma/prisma";
import { User } from "../../types/users";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "../../utils/responseGenerators";
import { CreateUser } from "./createUser";

export type UpdateUserPayload = Partial<CreateUser>;

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
    return (createErrorResponse(error));
  }
}