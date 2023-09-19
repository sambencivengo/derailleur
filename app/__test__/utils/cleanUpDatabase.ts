import prisma from "../../../prisma/prisma";

export enum TableNames {
  USERS = 'Users',
  POSTS = 'Posts'
}
export async function cleanUpTable(tableName: TableNames) {
  if (tableName === TableNames.USERS) {
    await prisma.users.deleteMany({});
  } else if (tableName === TableNames.POSTS) {
    await prisma.posts.deleteMany({});
  }
}