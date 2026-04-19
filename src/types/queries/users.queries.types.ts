
import { User } from "~/types";
import { DerailleurResponse } from "~/utils";

export interface CreateUserPayload {
  username: string;
  email?: string;
  /** @deprecated password is set via Better Auth, this field is ignored */
  password?: string;
  favoriteBikes?: Array<string>;
  location?: string | null;
}
export type UpdateUserPayload = Partial<CreateUserPayload>;

// Query Function Types
export type CreateUser = (user: CreateUserPayload, userId?: string) => Promise<DerailleurResponse<User>>;
export type GetUserById = (userId: string) => Promise<DerailleurResponse<User>>;
export type UpdateUser = (user: UpdateUserPayload, userId: string) => Promise<DerailleurResponse<User>>;
