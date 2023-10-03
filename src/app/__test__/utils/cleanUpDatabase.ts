import prisma from "../../../../prisma/prisma";

export type UserTable = typeof prisma.users;
export type PostTable = typeof prisma.posts;

export type Table = UserTable | PostTable;

export async function cleanUpTable(table: Table[]) {
  await Promise.all(table.map((table: any) => table.deleteMany({})));
}