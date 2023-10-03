
import { NextApiResponse } from "next";
import prisma from "../../../../prisma/prisma";


export default async function createUser(
  req: Request,
  res: NextApiResponse
) {
  const { username } = await req.json();
  const newUser = await prisma.users.create({
    data: {
      username,
    }
  });

  console.log('👤 User Created', newUser);

  return res.status(201).json(newUser);
}