
import { db } from "~/db";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import { PrismaQueryErrorCodes } from "~prisma/prismaErrorCodes";
import { CreateUserPayload, insertUserSchema } from "./user.queries.types";
import { users } from "~/db/schema/users";



export async function createUser(createUserPayload: CreateUserPayload): Promise<DerailleurResponse> {
  const userToInsert = insertUserSchema.parse(createUserPayload);
  try {
    const [insertedUser] = await db.insert(users).values(userToInsert).returning();
    return createSuccessfulResponse(insertedUser);
  } catch (error: any) {
    const errorData = { user: createUserPayload };
    if (error.code === PrismaQueryErrorCodes.UNIQUE_CONSTRAINT) {
      return createErrorResponse([{ message: 'Unable to save new user due to unique constraint', data: errorData }]);
    }
    return createErrorResponse([{ message: 'Unable to save new user due to prisma error', data: errorData }]);
  }
};
