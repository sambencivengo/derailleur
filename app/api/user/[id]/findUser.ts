import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/prisma";

export default async function findUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  }); // TODO: catch Errors

  console.log('👤 User Found', user);

  return res.status(201).json(user);
}