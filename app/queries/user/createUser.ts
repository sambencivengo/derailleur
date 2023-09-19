import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../../prisma/prisma";
import { v4 as uuid } from 'uuid';
import { User } from "../../../types/user";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "../../utils/responseGenerators";

export interface CreateUser {
  username: string;
}

export async function createUser(user: CreateUser, userId = uuid()): Promise<DerailleurResponse<User>> {
  try {
    const newUser = await prisma.users.create({
      data: {
        ...user,
        id: userId
      }
    });
    return createSuccessfulResponse(newUser);
  } catch (error: any) {
    const userError = error as PrismaClientKnownRequestError;
    return createErrorResponse(userError);
  }
};