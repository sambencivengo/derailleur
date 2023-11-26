
import { auth } from "~/auth/lucia";
import * as context from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createUser } from "~/queries";


export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
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
    // NOTE: From lucia auth docs
    const userResponse = await createUser({
      username,
      password
    });

    if (!userResponse.result) {
      return NextResponse.json(
        {
          error: userResponse.error!.message
        },
        {
          status: 400
        }
      );
    }


    const session = await auth.createSession({
      userId: userResponse.result.id,
      attributes: {}
    });
    console.log({ session });
    const authRequest = auth.handleRequest(request.method, context);
    console.log(authRequest);
    authRequest.setSession(session);

    // NOTE: replace lucia auth stuff with prisma queries
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/" // redirect to profile page
      }
    });
  } catch (e) {
    // NOTE: handle prismaQuery catches


    // this part depends on the database you're using
    // check for unique constraint error in user table
    // if (
    //   e instanceof SomeDatabaseError &&
    //   e.message === USER_TABLE_UNIQUE_CONSTRAINT_ERROR
    // ) {
    //   return NextResponse.json(
    //     {
    //       error: "Username already taken"
    //     },
    //     {
    //       status: 400
    //     }
    //   );
    // }

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