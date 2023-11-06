'use server';
import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/prisma";
import { v4 as uuid } from 'uuid';
import { User } from "../../types/users";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "../../utils/responseGenerators";
import { hashPassword } from "../../utils/hash";
import { PrismaQueryErrorCodes } from "../../../prisma/prismaErrorCodes";

export interface CreateUserPayload {
  username: string;
  password: string;
  favoriteBike?: string | null;
  location?: string | null;
}

export type CreateUser = (user: CreateUserPayload, userId?: string) => Promise<DerailleurResponse<User>>;

export async function createUser(user: CreateUserPayload, userId = uuid()): Promise<DerailleurResponse<User>> {

  const hash = await hashPassword(user.password);
  const password = hash?.result;
  if (!password) {
    return createErrorResponse('Unable to hash password in createUserQuery', { user });
  }

  try {
    const newUser = await prisma.users.create({
      data: {
        ...user,
        password,
        id: userId
      }
    });
    return createSuccessfulResponse(newUser);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse('Unable to save new user', { user, error: JSON.stringify(error) });
    }
    const errResponse = { user, prismaErrorCode: error.code };
    if (error.code === PrismaQueryErrorCodes.UNIQUE_CONSTRAINT) {
      return createErrorResponse('Unable to save new user due to unique constraint', errResponse);
    }
    return createErrorResponse('Unable to save new user due to prisma error', errResponse);
  }
};