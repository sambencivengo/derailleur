import prisma from "../../../prisma/prisma";
import { User } from "../../../types/user";

export type UpdateUser = Partial<User>;

export async function updateUser(userId: string, user: UpdateUser) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...user
    },
  });
}