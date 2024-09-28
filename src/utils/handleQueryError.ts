import { Prisma } from "@prisma/client";
import { createDerailleurError, DerailleurError } from "~/utils/responseGenerators";


interface HandlerQueryErrorArgs {
  error: any;
  errorMessageAndData: { errorMessage: string; data?: { [key: string]: any; }; };
  prismaErrorMessageAndData: { errorMessage: string; data?: { [key: string]: any; }; };
}

// TODO: In the future, expand the query error handler
export function handleQueryError({ error, errorMessageAndData, prismaErrorMessageAndData }: HandlerQueryErrorArgs): DerailleurError {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return createDerailleurError(errorMessageAndData.errorMessage, errorMessageAndData.data ?? {});
  }
  const prismaErrorData: {
    [key: string]: any;
    prismaErrorCode: string;
  } = {
    ...prismaErrorMessageAndData.data,
    prismaErrorCode: error.code
  };
  return createDerailleurError(prismaErrorMessageAndData.errorMessage, { prismaErrorData });
}