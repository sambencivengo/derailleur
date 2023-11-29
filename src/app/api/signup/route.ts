
import { v4 as uuid } from 'uuid';
import * as context from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createUser } from '~/queries';
import { auth } from '~/auth';


export const POST = async (request: NextRequest) => {

  // const formData = await request.formData();
  const body = await request.json();;
  const username = body.username;
  const password = body.password;
  // const username = formData.get("username");
  // const password = formData.get("password");
  // TODO: Extra validators here
  if (
    typeof username !== "string" ||
    username.length < 4 ||
    username.length > 31
  ) {
    return NextResponse.json(
      {
        error: "Invalid username"
      },
      {
        status: 400
      }
    );
  }
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return NextResponse.json(
      {
        error: "Invalid password"
      },
      {
        status: 400
      }
    );
  }

  try {
    const userId = uuid();

    // Abstracted Prisma Query that does not use Lucia
    const userResponse = await createUser({
      username,
    }, userId);
    if (userResponse.error) {
      return NextResponse.json(userResponse.error.message,
        {
          status: 401
        }
      );
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
    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/" // redirect to profile page
      }
    });
  } catch (e) {
    // NOTE: handle prismaQuery catches
    console.log(e);
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