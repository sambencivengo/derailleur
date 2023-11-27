'use server';
import { Prisma } from "@prisma/client";
import { v4 as uuid } from 'uuid';
import prisma from "~prisma/prisma";
import { DerailleurResponse, hashPassword, createErrorResponse, createSuccessfulResponse } from "~/utils";
import { PrismaQueryErrorCodes } from "~prisma/prismaErrorCodes";
import { CreateUserPayload, User } from "~/types";


export async function createUser(user: CreateUserPayload, userId = uuid()): Promise<DerailleurResponse<User>> {

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
      return createErrorResponse('Unable to save new user', { user, error: JSON.stringify(error) });
    }
    const errResponse = { user, prismaErrorCode: error.code };
    if (error.code === PrismaQueryErrorCodes.UNIQUE_CONSTRAINT) {
      return createErrorResponse('Unable to save new user due to unique constraint', errResponse);
    }
    return createErrorResponse('Unable to save new user due to prisma error', errResponse);
  }
};