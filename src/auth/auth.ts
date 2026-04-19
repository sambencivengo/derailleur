import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import * as argon2 from "argon2";
import prisma from "~prisma/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 2,
    maxPasswordLength: 50,
    password: {
      hash: async (password) => argon2.hash(password),
      verify: async ({ hash, password }) => argon2.verify(hash, password),
    },
  },
  plugins: [
    username({
      minUsernameLength: 2,
      maxUsernameLength: 30,
    }),
    nextCookies(),
  ],
});
