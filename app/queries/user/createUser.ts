import prisma from "../../../prisma/prisma";

export interface CreateUser {
  username: string;
}

export async function createUser(user: CreateUser) {
  return await prisma.user.create({
    data: user
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