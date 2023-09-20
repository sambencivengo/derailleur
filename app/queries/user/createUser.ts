import prisma from "../../../prisma/prisma";
import { v4 as uuid } from 'uuid';
import { User } from "../../../types/user";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "../../utils/responseGenerators";

export interface CreateUserPayload {
  username: string;
  favoriteBike?: string;
  location?: string;
}

export type CreateUser = (user: CreateUserPayload, userId?: string) => Promise<DerailleurResponse<User>>;
export async function createUser(user: CreateUserPayload, userId = uuid()): Promise<DerailleurResponse<User>> {
  try {
    const newUser = await prisma.users.create({
      data: {
        ...user,
        id: userId
      }
    });
    return createSuccessfulResponse(newUser);
  } catch (error: any) {
    return createErrorResponse(error);
  }
};