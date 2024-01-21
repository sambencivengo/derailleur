import { v4 as uuid } from 'uuid';
import * as context from "next/headers";
import { LuciaError } from "lucia";
import { auth } from "~/auth";
import { LogInSchema, userLogInSchema, validateSchema } from "~/schemas";
import { createNextResponse } from "~/utils";
import prisma from "~prisma/prisma";
import { createUser } from '~/queries';

export const POST = async (req: Request) => {

  const body = await req.json();
  const validateResponse = validateSchema<LogInSchema>({ body, schema: userLogInSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    return (createNextResponse({ errors: validateResponse.errors, status: 400 }));
  }

  const { password, username } = validateResponse.result;

  if (process.env.NODE_ENV === 'development' && username === 'sammy') {
    const userId = uuid();
    const existingSeededUser = await prisma.user.findUnique({
      where: {
        username
      }
    });

    if (!existingSeededUser) {
      console.log("Seeded user not found, creating user");
      await createUser({ username }, userId);
    }

    await createKeyForDevAccount(password, username, userId);
    return (await useKeyAndCreateSession(username, password, req));
  } else {
    return (await useKeyAndCreateSession(username, password, req));
  }
};

async function createKeyForDevAccount(password: string, username: string = 'sammy', userId: string) {

  const existingKey = await prisma.key.findFirst({
    where: {
      user_id: userId
    }
  });

  if (!existingKey) {
    console.log("Dev User found without key, creating key 🔑");
    await auth.createKey({
      password,
      providerId: 'username',
      providerUserId: username.toLowerCase(),
      userId,
    });
  }
  else {
    console.log("Dev User found with key 🔑");
  }
};

async function useKeyAndCreateSession(username: string, password: string, req: Request) {
  try {
    const key = await auth.useKey("username", username.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {}
    });
    const authRequest = auth.handleRequest(req.method, context);
    authRequest.setSession(session);
    return (createNextResponse({ result: 'success', status: 201 }));
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      return (createNextResponse({ errors: [{ message: "Incorrect username or password", data: {} }], status: 401 }));
    }
    return (createNextResponse({ errors: [{ message: "An unknown error occurred", data: {} }], status: 500 }));
  }
}