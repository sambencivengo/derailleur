import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export default async function createUser(
  username: string,
  res: NextApiResponse
) {
  const newUser = await prisma.user.create({
    data: {
      username,

    }
  }); // TODO: catch Errors

  console.log('👤 User Created', newUser);

  return res.status(201).json(newUser);
}