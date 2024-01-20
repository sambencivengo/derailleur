
import * as context from "next/headers";
import { LuciaError } from "lucia";
import { auth } from "~/auth";
import { LogInSchema, userLogInSchema, validateSchema } from "~/schemas";
import { createErrorResponse, createNextResponse } from "~/utils";
import prisma from "~prisma/prisma";

export const POST = async (req: Request) => {

  const body = await req.json();
  const validateResponse = validateSchema<LogInSchema>({ body, schema: userLogInSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    return (createNextResponse({ errors: validateResponse.errors, status: 400 }));
  }

  const { password, username } = validateResponse.result;

  if (username === 'sammy') {
    await createKeyForDevAccount(password, username);

    const key = await auth.useKey("username", username.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {}
    });
    const authRequest = auth.handleRequest(req.method, context);
    authRequest.setSession(session);
    return (createNextResponse({ result: 'success', status: 201 }));
  } else {
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
};

async function createKeyForDevAccount(password: string, username: string = 'sammy') {
  const existingSeededUser = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if (!existingSeededUser) {
    return (createErrorResponse([{ data: { username, password }, message: "❌ Dev User was not found. Database seed was unsuccessful ❌" }]));
  }
  else {
    const existingKey = await prisma.key.findFirst({
      where: {
        user_id: existingSeededUser.id
      }
    });

    if (!existingKey) {
      console.log("Dev User found without key, creating key 🔑");
      await auth.createKey({
        password,
        providerId: 'username',
        providerUserId: username.toLowerCase(),
        userId: existingSeededUser.id,
      });
    }
    else {
      console.log("Dev User found with key 🔑");
    }
  }
};