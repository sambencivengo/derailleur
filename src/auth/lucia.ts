
// auth/lucia.ts
import { lucia } from "lucia";
import { prisma } from "@lucia-auth/adapter-prisma";
import { nextjs_future } from "lucia/middleware";
import prismaClient from '../../prisma/prisma';

export const auth = lucia({
  adapter: prisma(prismaClient,
    {
      key: "key",
      session: "session",
      user: "user",
    }),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false
  },

  getUserAttributes: (data) => {
    return {
      username: data.username
    };
  }
});

export type Auth = typeof auth;