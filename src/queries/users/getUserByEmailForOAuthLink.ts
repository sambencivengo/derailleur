'use server';
import { Prisma } from "@prisma/client";
import { userProfileWithOAuth, UserProfileWithOAuth } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

export async function getUserByEmailForOAuthLink(email: string, providerId: string): Promise<DerailleurResponse<UserProfileWithOAuth | null>> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email
      },
      ...userProfileWithOAuth,
      include: {
        oAuthAccounts: {
          where: {
            providerId
          }
        }
      }
    });
    if (!user) {
      return createSuccessfulResponse(null);
    }
    return createSuccessfulResponse(user);
  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying find user by email', data: { email, error: JSON.stringify(error) } }]);
    }
    const errResponse = { email, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find user by email due to prisma error', data: errResponse }]);
  }
};