'use server';
import { Prisma } from "@prisma/client";
import { v4 as uuid } from 'uuid';
import prisma from "~prisma/prisma";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import { PrismaQueryErrorCodes } from "~prisma/prismaErrorCodes";
import { CreateUserPayload, User } from "~/types";


export async function createUser(user: CreateUserPayload, userId = uuid()): Promise<DerailleurResponse<User>> {

  // NOTE: Create User Schema validation is in API call

  try {
    const newUser = await prisma.user.create({
      data: {
        ...user,
        id: userId,
      },
    });
    return createSuccessfulResponse(newUser);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'Unable to save new user', data: { user, error: JSON.stringify(error) } }]);
    }
    const errorData = { user, prismaErrorCode: error.code };
    if (error.code === PrismaQueryErrorCodes.UNIQUE_CONSTRAINT) {
      return createErrorResponse([{ message: 'Unable to save new user due to unique constraint', data: errorData }]);
    }
    return createErrorResponse([{ message: 'Unable to save new user due to prisma error', data: errorData }]);
  }
};