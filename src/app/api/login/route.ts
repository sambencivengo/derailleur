
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
};