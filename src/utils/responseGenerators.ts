import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export interface DerailleurError {
  message: string,
  data: string | {[key:string]:any}
}
export interface DerailleurResponse<T = any> {
  result: T | null;
  error: DerailleurError | null
}

export function createSuccessfulResponse<T = any>(result: T): DerailleurResponse<T> {
  return ({ result, error: null });
}

export function createErrorResponse(message: string, data: string | {[key:string]:any} ): DerailleurResponse<any> {
  const error: DerailleurError = {
    message, 
    data,
  }
  return ({ result: null, error });
}
