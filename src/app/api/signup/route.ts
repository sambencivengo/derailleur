'use server';
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { createUser } from '~/queries';
import { auth } from '~/auth';
import { SignUpSchema, userSignUpSchema, validateSchema } from '~/schemas';
import { createNextResponse } from '~/utils';
import { cookies } from 'next/headers';

export const POST = async (req: Request) => {
  const body = await req.json();
  const validateResponse = validateSchema<SignUpSchema>({ body, schema: userSignUpSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    return (createNextResponse({ errors: validateResponse.errors, status: 400 }));
  }
  const { password, username } = validateResponse.result;

  try {
    const hashedPassword = await argon2.hash(password);
    const userId = uuid();
    const userResponse = await createUser({
      username,
      password: hashedPassword
    }, userId);

    if (userResponse.errors.length > 0 || userResponse.result === null) {
      return (createNextResponse({ errors: userResponse.errors, status: 401 }));
    }

    const session = await auth.createSession(userId, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return (createNextResponse({ result: 'success', status: 200 }));
  } catch (e) {
    return (createNextResponse({ errors: [{ message: "An unknown error occurred", data: {} }], status: 500 }));
  }
};