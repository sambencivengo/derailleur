import { Prisma, User as PrismaUser } from "@prisma/client";

export interface UserWithHashedPassword extends PrismaUser { }

export interface User extends Omit<PrismaUser, 'hashedPassword'> { }

export interface UserAndSession {
  username: string;
  userId: string;
  sessionId: string;
  expiresAt: Date;
  fresh: boolean;
}


export const userProfile = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    username: true,
    favoriteBikes: true,
    location: true,
  }
});

export type UserProfile = Prisma.UserGetPayload<typeof userProfile>;