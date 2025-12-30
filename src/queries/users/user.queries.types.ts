import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "~/db/schema/users";
import { User } from "~/types";
import { DerailleurResponse } from "~/utils";

export const insertUserSchema = createInsertSchema(users);
export type CreateUserPayload = z.infer<typeof insertUserSchema>;

export type UpdateUserPayload = Omit<Partial<CreateUserPayload>, 'password'>;

// Query Function Types
export type CreateUser = (user: CreateUserPayload, userId?: string) => Promise<DerailleurResponse<User>>;
export type GetUserById = (userId: string) => Promise<DerailleurResponse<User>>;
export type UpdateUser = (user: UpdateUserPayload, userId: string) => Promise<DerailleurResponse<User>>;

