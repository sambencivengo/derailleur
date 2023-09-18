import prisma from "../../../prisma/prisma";
import { v4 as uuid } from 'uuid';

export interface CreateUser {
  username: string;
}

export async function createUser(user: CreateUser, userId = uuid()) {
  return await prisma.user.create({
    data: {
      ...user,
      id: userId
    }
  });
}

export async function updateUsername(userId: string, username: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      username
    },
  });
}