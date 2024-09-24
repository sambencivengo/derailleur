
import { User } from "~/types";
import { DerailleurResponse } from "~/utils";

export interface CreateUserPayload {
  username?: string;
  email: string;
  // TODO: when user passwords are moved to their own table, remove
  password?: string;
  favoriteBikes?: Array<string>;
  location?: string | null;
}
export type UpdateUserPayload = Omit<Partial<CreateUserPayload>, 'password'>;

// Query Function Types
export type CreateUser = (user: CreateUserPayload, userId?: string) => Promise<DerailleurResponse<User>>;
export type GetUserById = (userId: string) => Promise<DerailleurResponse<User>>;
export type UpdateUser = (user: UpdateUserPayload, userId: string) => Promise<DerailleurResponse<User>>;
