'use server';
import prisma from "../../../prisma/prisma";
import { v4 as uuid } from 'uuid';
import { User } from "../../types/users";
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse } from "../../utils/responseGenerators";
import { hashPassword } from "../../utils/hash";

export interface CreateUserPayload {
  username: string;
  password: string;
  favoriteBike?: string | null;
  location?: string | null;
}

export type CreateUser = (user: CreateUserPayload, userId?: string) => Promise<DerailleurResponse<User>>;

export async function createUser(user: CreateUserPayload, userId = uuid()): Promise<DerailleurResponse<User>> {
  let password: string;
  try {
    const hash = await hashPassword(user.password);
    password = hash.result!;
  } catch (error) {
    console.log('error in createUser', error);
    return createErrorResponse(error);
  };

  try {
    const newUser = await prisma.users.create({
      data: {
        ...user,
        password,
        id: userId
      }
    });
    return createSuccessfulResponse(newUser);
  } catch (error: any) {
    return createErrorResponse(error);
  }
};