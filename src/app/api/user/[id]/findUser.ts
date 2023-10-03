import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/prisma";

export default async function findUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  const user = await prisma.users.findUnique({
    where: {
      id
    }
  }); // TODO: catch Errors

  console.log('👤 User Found', user);

  return res.status(201).json(user);
}