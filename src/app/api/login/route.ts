'use server';
import * as argon2 from 'argon2';
import { LogInSchema } from "~/schemas/userSchemas";
import { validateSchema } from "~/schemas/schemaValidator";
import { userLogInSchema } from "~/schemas/userSchemas";
import { createNextResponse } from "~/utils";
import { cookies } from 'next/headers';
import { auth } from '~/auth';
import { getUserByUsernameForLogin } from '~/queries/users/getUserByUsernameForLogin';

export const POST = async (req: Request) => {
  const body = await req.json();
  const validateResponse = validateSchema<LogInSchema>({ body, schema: userLogInSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    return (createNextResponse({ errors: validateResponse.errors, status: 400 }));
  }
  const { password, username } = validateResponse.result;

  try {
    const getUserByUsernameResponse = await getUserByUsernameForLogin(username);

    if (getUserByUsernameResponse.result === null || getUserByUsernameResponse.errors.length > 0) {
      return (createNextResponse({ errors: getUserByUsernameResponse.errors, status: 400 }));
    }

    const { hashedPassword, id: userId } = getUserByUsernameResponse.result;
    const validPassword = await argon2.verify(hashedPassword, password);
    if (!validPassword) {
      return (createNextResponse({ errors: [{ data: {}, message: "Incorrect username or password" }], status: 403 }));
    }
    const session = await auth.createSession(userId, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return (createNextResponse({ result: 'success', status: 201 }));
  } catch (error) {
    console.log(error);
    return (createNextResponse({ errors: [{ message: "An unknown error occurred", data: {} }], status: 500 }));
  }
};
