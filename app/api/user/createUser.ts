import prisma from "../../../prisma/prisma";
import { NextApiResponse } from "next";


export default async function createUser(
  req: Request,
  res: NextApiResponse
) {
  const { username } = await req.json();
  const newUser = await prisma.user.create({
    data: {
      username,

    }
  });

  console.log('👤 User Created', newUser);

  return res.status(201).json(newUser);
}