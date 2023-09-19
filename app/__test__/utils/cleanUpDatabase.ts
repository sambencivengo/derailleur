import prisma from "../../../prisma/prisma";

type UserIds = Array<string>;

enum TableNames
{
  USER = 'user',
  POST = 'post'
}
export async function cleanUserTable(arrayOfIds: UserIds, tableName: TableNames)
{


  if (tableName === TableNames.POST)
  {

  } else if (tableName === TableNames.USER)
  {

  }


  const deleteUserPromises = arrayOfIds.map((id) =>
  {
    return prisma.user.delete({
      where: {
        id
      }
    });
  });

  await Promise.all(deleteUserPromises);

}

function createDeletePromises(arrayOfIds: UserIds)
{
  for (let i = 0, limi = arrayOfIds.length; i < limi; i++)
  {

  }
}