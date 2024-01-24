
// auth/lucia.ts
// import { lucia } from "lucia";
// import { prisma } from "@lucia-auth/adapter-prisma";
// import { nextjs_future } from "lucia/middleware";



// auth/lucia.ts
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

import prismaClient from '~prisma/prisma';

const adapter = new PrismaAdapter(prismaClient.session, prismaClient.user);


export const auth = new Lucia(
  adapter,
  {
    sessionCookie: {
      // this sets cookies with super long expiration
      // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
      // https://v3.lucia-auth.com/getting-started/nextjs-app
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production",
      }
    }
    // {
    // adapter: prisma(prismaClient),
    // env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
    // middleware: nextjs_future(),
    // sessionCookie: {
    //   expires: false
    // },

    // getUserAttributes: (data) => {
    //   return {
    //     username: data.username
    //   };
    // }
  }
);

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
  }
}
