import * as argon2 from "argon2";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "~/utils";


export async function hashPassword(plainTextPassword: string): Promise<DerailleurResponse<string>> {
  try {
    const hash = await argon2.hash(plainTextPassword);
    return createSuccessfulResponse(hash);
  } catch (error) {
    return createErrorResponse("Unable to hash password", { plainTextPassword });
  }
}

export async function verifyPassword(plainTextPassword: string, hash: string): Promise<DerailleurResponse<boolean>> {
  try {
    const verified = await argon2.verify(hash, plainTextPassword);
    return createSuccessfulResponse(verified);
  } catch (error) {
    return createErrorResponse("Unable to verify password", { plainTextPassword, hash });
  }
}
