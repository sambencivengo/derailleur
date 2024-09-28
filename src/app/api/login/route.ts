'use server';
import * as argon2 from 'argon2';
import { UserLogInSchema, userLogInSchema, validateSchema } from "~/schemas";
import { createNextResponse } from "~/utils";
import { cookies } from 'next/headers';
import { auth } from '~/auth';
import { getUserByUsernameOrEmailForLogin } from '~/queries/users/getUserByUsernameOrEmailForLogin';

export const POST = async (req: Request) => {
  const body = await req.json();
  const validateResponse = validateSchema<UserLogInSchema>({ body, schema: userLogInSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    return (createNextResponse({ errors: validateResponse.errors, status: 400 }));
  }
  const { password, usernameOrEmail } = validateResponse.result;

  try {
    const getUserByEmailResponse = await getUserByUsernameOrEmailForLogin(usernameOrEmail);

    if (getUserByEmailResponse.result === null || getUserByEmailResponse.errors.length > 0) {
      return (createNextResponse({ errors: getUserByEmailResponse.errors, status: 400 }));
    }

    const { hashedPassword, id: userId } = getUserByEmailResponse.result;
    const validPassword = await argon2.verify(hashedPassword, password);
    if (!validPassword) {
      return (createNextResponse({ errors: [{ data: {}, message: "Incorrect email or password" }], status: 403 }));
    }
    const session = await auth.createSession(userId, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return (createNextResponse({ result: 'success', status: 201 }));
  } catch (error) {
    return (createNextResponse({ errors: [{ message: "An unknown error occurred", data: {} }], status: 500 }));
  }
};