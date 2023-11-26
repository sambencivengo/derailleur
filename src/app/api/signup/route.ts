
import { v4 as uuid } from 'uuid';
import { auth } from "~/auth/lucia";
import * as context from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createUser } from "~/queries";
import prisma from '~prisma/prisma';


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
    const userId = uuid();
    // NOTE: From lucia auth docs
    const userResponse = await createUser({
      username,
      password
    }, userId);

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
      attributes: {
        id: uuid(),
        active_expires: new Date('1/1/2025'),
        idle_expires: new Date('1/1/2025'),
        userId: userId
      },
      userId: userId
    }).catch((e) => {
      console.log('IN CATCH FOR CREATE SESSION', e);
    });

    // const session = await prisma.session.create({
    //   data: {
    //     id: uuid(),
    //     active_expires: new Date('1/1/2025'),
    //     idle_expires: new Date('1/1/2025'),
    //     userId: userResponse.result.id,
    //   }
    // });

    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);
    console.log('SESSION AFTER SET', authRequest);

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