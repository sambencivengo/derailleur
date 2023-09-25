import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import prisma from "../../../prisma/prisma";

export type PrismaUsers = typeof prisma.users;
export type PrismaPosts = typeof prisma.posts;
export type PrismaTable = PrismaUsers | Prisma.UsersDelegate<DefaultArgs>;

export async function cleanUpTable(table: PrismaTable[]) {
  await Promise.all(table.map((table) => table.deleteMany({})));
}