import { User as PrismaUser } from "@prisma/client";

export interface UserWithHashedPassword extends PrismaUser { }

export interface User extends Omit<PrismaUser, 'hashedPassword'> { }
