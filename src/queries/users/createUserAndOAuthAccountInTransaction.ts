import { OAuthAccount, User } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { createErrorResponse, createSuccessfulResponse, DerailleurResponse } from '~/utils';
import { generateUserNameFromEmail } from "~/utils/generateUsername";
import { handleQueryError } from '~/utils/handleQueryError';
import prisma from "~prisma/prisma";

interface CreateUserAndOAuthAccountTransactionArgs {
  email: string;
  userId?: string;
  oAuthAccountId?: string;
  providerId: string;
  providerUserId: string | number;
}

export async function createUserAndOAuthAccountInTransaction({ email, providerId, providerUserId, userId = uuid(), oAuthAccountId = uuid() }: CreateUserAndOAuthAccountTransactionArgs): Promise<DerailleurResponse<{ user: User, oAuthAccount: OAuthAccount; }>> {
  try {
    const result = await prisma.$transaction(async (prismaTx) => {
      const user = await prismaTx.user.create({
        data: {
          id: userId,
          username: generateUserNameFromEmail(email),
          email: email,
          hashedPassword: '', // TODO: Move passwords to their own table
          favoriteBikes: [],
        }
      });
      const oAuthAccount = await prismaTx.oAuthAccount.create({
        data: {
          id: oAuthAccountId,
          providerId,
          providerUserId: providerUserId.toString(),
          userId
        }
      });
      return { user, oAuthAccount };
    });
    return createSuccessfulResponse(result);
  } catch (error: any) {
    const data = { email, providerId, providerUserId, userId, oAuthAccountId };
    const queryError = handleQueryError({
      error, errorMessageAndData: {
        errorMessage: 'An error occurred when trying to create a user and OAuth Account',
        data
      },
      prismaErrorMessageAndData: {
        errorMessage: 'Unable to create user and OAuth account due to a prisma error',
        data,
      }
    });
    return createErrorResponse([queryError]);
  }
}