'use server';
import * as argon2 from 'argon2';
import { LogInSchema, userLogInSchema, validateSchema } from "~/schemas";
import { createNextResponse } from "~/utils";
import { getUserByUsername } from '~/queries';
import { cookies } from 'next/headers';
import { auth } from '~/auth';

export const POST = async (req: Request) => {

  const body = await req.json();
  const validateResponse = validateSchema<LogInSchema>({ body, schema: userLogInSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    return (createNextResponse({ errors: validateResponse.errors, status: 400 }));
  }
  const { password, username } = validateResponse.result;

  try {
    const getUserByUsernameResponse = await getUserByUsername(username);

    if (getUserByUsernameResponse.result === null || getUserByUsernameResponse.errors.length > 0) {
      return (createNextResponse({ errors: getUserByUsernameResponse.errors, status: 400 }));
    }

    const user = getUserByUsernameResponse.result;
    const validPassword = await argon2.verify(user.hashedPassword, password);

    if (!validPassword) {
      return (createNextResponse({ errors: [{ data: {}, message: "Incorrect username or password" }], status: 403 }));
    }

    const session = await auth.createSession(user.id, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return (createNextResponse({ result: 'success', status: 201 }));
  } catch (error) {
    return (createNextResponse({ errors: [{ message: "An unknown error occurred", data: {} }], status: 500 }));
  }
};