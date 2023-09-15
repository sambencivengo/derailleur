import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export default async function createUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.body;
  const newUser = await prisma.user.create({
    data: {
      username,

    }
  }); // TODO: catch Errors

  console.log('👤 User Created', newUser);

  return res.status(201).json(newUser);
}