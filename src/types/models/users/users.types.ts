import { Prisma, User as PrismaUser } from "@prisma/client";

export interface User extends PrismaUser { }

export interface UserAndSession {
  username: string;
}


export const userProfile = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    username: true,
    favoriteBikes: true,
    location: true,
    createdAt: true,
    updatedAt: true,
  }
});

export type UserProfile = Prisma.UserGetPayload<typeof userProfile>;