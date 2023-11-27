
import { v4 as uuid } from 'uuid';
import * as context from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createUser } from '~/queries';
import prisma from '~prisma/prisma';
import { auth } from '~/auth/lucia';


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
    const user = await auth.createUser({
      attributes: {
        username,
      },
      userId: userId,
      key: null
    });

    // const user = await prisma.user.create({
    //   data: {
    //     id: userId,
    //     username,
    //   }
    // });
    const key = await prisma.key.create({
      data: {
        id: uuid(),
        hashed_password: password,
        user_Id: userId
      }
    }).catch((e) => {
      console.log('IN KEY CATCH', e);
    });
    const expiration = new Date('1/1/2025');
    const session = await auth.createSession({
      userId: userId,
      attributes: {
        active_expires: expiration,
        idle_expires: expiration
      }
    });
    const authRequest = auth.handleRequest(request.method, context);

    authRequest.setSession(session);
    console.log('AFTER SESSION SET');
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/" // redirect to profile page
      }
    });

    // const session = await auth.createSession({
    //   attributes: {
    //     id: uuid(),
    //     active_expires: new Date('1/1/2025'),
    //     idle_expires: new Date('1/1/2025'),
    //     userId: userId
    //   },
    //   userId: userId
    // }).catch((e) => {
    //   console.log('IN CATCH FOR CREATE SESSION', e);
    // });

    // const session = await prisma.session.create({
    //   data: {
    //     id: uuid(),
    //     active_expires: new Date('1/1/2025'),
    //     idle_expires: new Date('1/1/2025'),
    //     userId: userResponse.result.id,
    //   }
    // });
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