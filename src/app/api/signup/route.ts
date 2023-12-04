
import { v4 as uuid } from 'uuid';
import * as context from "next/headers";
import { createUser } from '~/queries';
import { auth } from '~/auth';
import { SignUpSchema, userSignUpSchema, validateSchema } from '~/schemas';
import { createNextResponse } from '~/utils';

export const POST = async (req: Request) => {
  const body = await req.json();

  const validateResponse = validateSchema<SignUpSchema>({ body, schema: userSignUpSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    return (createNextResponse({ errors: validateResponse.errors, status: 400 }));
  }

  const { password, username } = validateResponse.result;

  try {
    const userId = uuid();
    // Abstracted Prisma Query that does not use Lucia
    const userResponse = await createUser({
      username,
    }, userId);
    if (userResponse.errors.length > 0 || userResponse.result === null) {
      return (createNextResponse({ errors: userResponse.errors, status: 401 }));
    }

    // Lucia Auth call using the prisma adapter
    await auth.createKey({
      password,
      providerId: 'username',
      providerUserId: username.toLowerCase(),
      userId,
    });

    const session = await auth.createSession({
      userId: userId,
      attributes: {}
    });
    const authRequest = auth.handleRequest(req.method, context);
    authRequest.setSession(session);

    return (createNextResponse({ result: 'success', status: 200 }));
  } catch (e) {
    // NOTE: handle prismaQuery catches
    return (createNextResponse({ errors: [{ message: "An unknown error occurred", data: {} }], status: 500 }));
  }
};