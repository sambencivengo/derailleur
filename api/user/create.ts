import { Prisma, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export default async function createUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.body;
  const newUSer = await prisma.user.create({
    data: {
      username
    }
  });
  // TODO: catch Errors
}