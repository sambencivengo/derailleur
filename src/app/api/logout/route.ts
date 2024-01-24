'use server';
import { cookies } from "next/headers";
import { getUserSession } from "~/auth";
import { auth } from "~/auth";
import { createNextResponse } from "~/utils";

export const POST = async (request: Request) => {

  const userAndSession = await getUserSession();
  if (!userAndSession) {
    return (createNextResponse({ errors: [{ data: {}, message: 'Unauthorized' }], status: 410 }));
  }

  await auth.invalidateSession(userAndSession.sessionId);
  const sessionCookie = auth.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/" // redirect to login page
    }
  });
};