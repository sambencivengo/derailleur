
import * as context from "next/headers";
import { NextResponse } from "next/server";
import { LuciaError } from "lucia";
import { auth } from "~/auth";
import { LogInSchema, userLogInSchema, validateSchema } from "~/schemas";
import { createNextResponse } from "~/utils";

export const POST = async (req: Request) => {

  const body = await req.json();
  const validateResponse = validateSchema<LogInSchema>({ body, schema: userLogInSchema });
  if (validateResponse.result === null || validateResponse.errors.length > 0) {
    return (createNextResponse({ errors: validateResponse.errors, status: 400 }));
  }

  const { password, username } = validateResponse.result;

  try {
    // find user by key
    // and validate password
    const key = await auth.useKey("username", username.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {}
    });
    const authRequest = auth.handleRequest(req.method, context);
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/" // redirect to profile page
      }
    });
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      // user does not exist or invalid password
      return NextResponse.json(
        {
          error: "Incorrect username or password"
        },
        {
          status: 400
        }
      );
    }
    return NextResponse.json(
      {
        error: "An unknown error occurred"
      },
      {
        status: 500
      }
    );
  }
};