import prisma from "../../../prisma/prisma";
import { v4 as uuid } from 'uuid';

export interface CreateUser {
  username: string;
}

export async function createUser(user: CreateUser, userId = uuid()) {
  const newUser = await prisma.user.create({
    data: {
      ...user,
      id: userId
    }
  });
  return (newUser);
}