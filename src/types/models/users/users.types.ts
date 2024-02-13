import { User as PrismaUser } from "@prisma/client";

export interface UserWithHashedPassword extends PrismaUser { }

export interface User extends Omit<PrismaUser, 'hashedPassword'> { }

export interface UserAndSession {
  username: string;
  userId: string;
  sessionId: string;
  expiresAt: Date;
  fresh: boolean;
}
