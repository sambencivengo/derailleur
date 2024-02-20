import prisma from "~prisma/prisma";

export type UserTable = typeof prisma.user;
export type PostTable = typeof prisma.post;
export type TagTable = typeof prisma.tag;
export type CommentTable = typeof prisma.comment;

export type Table = UserTable | PostTable | TagTable | CommentTable;

export async function cleanUpTable(table: Table[]) {
  await Promise.all(table.map((table: any) => table.deleteMany({})));
}