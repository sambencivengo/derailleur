import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export interface DerailleurResponse<T = any> {
  result: T | null;
  error: PrismaClientKnownRequestError | any | null;
};

export function createSuccessfulResponse<T = any>(result: T): DerailleurResponse<T> {
  return ({ result, error: null });
};

export function createErrorResponse(error: any): DerailleurResponse<any> {
  return ({ result: null, error });
};
