'use server';
import { Prisma } from "@prisma/client";
import { v4 as uuid } from 'uuid';
import prisma from "~prisma/prisma";
import { DerailleurResponse, hashPassword, createErrorResponse, createSuccessfulResponse } from "~/utils";
import { PrismaQueryErrorCodes } from "~prisma/prismaErrorCodes";
import { CreateUserPayload, User } from "~/types";


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