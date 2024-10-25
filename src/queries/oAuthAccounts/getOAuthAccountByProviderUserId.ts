
import { OAuthAccount } from "~/types/models/oAuthAccounts/oAuthAccounts";
import { createErrorResponse, createSuccessfulResponse, DerailleurResponse } from "~/utils";
import { handleQueryError } from "~/utils/handleQueryError";
import prisma from "~prisma/prisma";


interface GetOAuthAccountArgs {
  providerUserId: string,
  providerId: string;
}

export async function getOAuthAccountByProviderUserId({ providerUserId, providerId }: GetOAuthAccountArgs): Promise<DerailleurResponse<OAuthAccount | null>> {

  try {
    const oAuthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        providerId,
        providerUserId
      }
    });
    if (!oAuthAccount) {
      return (createSuccessfulResponse(null));
    }
    return createSuccessfulResponse(oAuthAccount);
  } catch (error) {
    const data = {};
    const queryError = handleQueryError({
      error, errorMessageAndData: {
        errorMessage: 'An error occurred when trying to find OAuth Account',
        data
      },
      prismaErrorMessageAndData: {
        errorMessage: 'Unable to find OAuthAccount due to a prisma error',
        data,
      }
    });
    return createErrorResponse([queryError]);
  }
}