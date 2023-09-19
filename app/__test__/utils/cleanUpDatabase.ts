import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type PrismaTable = Prisma.UsersDelegate<DefaultArgs> | Prisma.UsersDelegate<DefaultArgs>;

export async function cleanUpTable(prismaTable: PrismaTable) {
  await prismaTable.deleteMany({});
}