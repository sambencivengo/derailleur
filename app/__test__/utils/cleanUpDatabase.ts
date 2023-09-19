import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/prisma";

type UserIds = Array<string>;
export async function cleanUserTable<T>(arrayOfIds: UserIds, modelName: 'user' | 'post') {
  const deleteUserPromises = arrayOfIds.map((id) => {

    return prisma.$extends(
      {
        model: {
          $allModels: {
            async exists(
              this: T,
              where: Prisma.Args<T, 'delete'>['where']
            );
          }
        }
      }
    );
  });

  await Promise.all(deleteUserPromises);
}