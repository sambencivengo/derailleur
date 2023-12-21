import prisma from "~prisma/prisma";

export type UserTable = typeof prisma.user;
export type PostTable = typeof prisma.post;

export type Table = UserTable | PostTable;

export async function cleanUpTable(table: Table[]) {
  await Promise.all(table.map((table: any) => table.deleteMany({})));
}