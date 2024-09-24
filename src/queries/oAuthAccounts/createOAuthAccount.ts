import { OAuthAccount } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { createErrorResponse, createSuccessfulResponse, DerailleurResponse } from "~/utils";
import { handleQueryError } from "~/utils/handleQueryError";
import prisma from "~prisma/prisma";

interface CreateOAuthAccountArgs {
  providerId: string;
  providerUserId: string;
  userId: string;
}

export async function createOAuthAccount({ providerId, providerUserId, userId }: CreateOAuthAccountArgs, id = uuid()): Promise<DerailleurResponse<OAuthAccount>> {
  try {
    const oAuthAccount = await prisma.oAuthAccount.create({
      data: {
        id,
        providerId,
        providerUserId: providerUserId.toString(),
        userId
      }
    });
    return createSuccessfulResponse(oAuthAccount);
  } catch (error: any) {
    const errorData = { providerId, providerUserId, userId };
    const derailleurError = handleQueryError({
      error,
      errorMessageAndData: { errorMessage: "An error occurred while attempting to create an OAuth account", data: errorData },
      prismaErrorMessageAndData: { errorMessage: 'Unable to create OAuth account due to Prisma error', data: errorData }
    });
    return (createErrorResponse([derailleurError]));
  }
}