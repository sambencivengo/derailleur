import prisma from "~prisma/prisma";

export type UserTable = typeof prisma.user;
export type PostTable = typeof prisma.post;
export type TagTable = typeof prisma.tag;
export type CommentTable = typeof prisma.comment;

export type Table = UserTable | PostTable | TagTable | CommentTable;

/** Delete in dependency order so FKs are satisfied. */
export async function cleanUpTable(tables: Table[]) {
  const hasUser = tables.includes(prisma.user as Table);
  if (hasUser) {
    await prisma.userLikedPosts.deleteMany({});
    await prisma.userSavedPosts.deleteMany({});
    await prisma.userLikedComments.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
  }
  await Promise.all(tables.map((t: any) => t.deleteMany({})));
}