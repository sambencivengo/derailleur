import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/prisma";



export default async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  const user = await prisma.users.delete({
    where: {
      id
    }
  });
  // TODO: catch error or if there is no user found

  console.log('👤 User Deleted', user);
  return res.status(200).json("User Deleted");
}