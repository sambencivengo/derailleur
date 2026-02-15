'use server';
import { Prisma } from "@prisma/client";
import { v4 as uuid } from 'uuid';
import prisma from "~prisma/prisma";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import { PrismaQueryErrorCodes } from "~prisma/prismaErrorCodes";
import { CreateUserPayload, User } from "~/types";


export async function createUser(createUserPayload: CreateUserPayload, userId = uuid()): Promise<DerailleurResponse<User>> {

  // NOTE: Create User Schema validation is in API call
  const { password, username, favoriteBikes, location } = createUserPayload;

  try {
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        username,
        hashedPassword: password,
        favoriteBikes,
        location,
      },
    });
    return createSuccessfulResponse(newUser);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'Unable to save new user', data: { user: createUserPayload, error: JSON.stringify(error) } }]);
    }
    const errorData = { user: createUserPayload, prismaErrorCode: error.code };
    if (error.code === PrismaQueryErrorCodes.UNIQUE_CONSTRAINT) {
      return createErrorResponse([{ message: 'Unable to save new user due to unique constraint', data: errorData }]);
    }
    return createErrorResponse([{ message: 'Unable to save new user due to prisma error', data: errorData }]);
  }
};
