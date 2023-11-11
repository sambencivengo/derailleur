import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider, { CredentialsConfig } from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? ""
    }),
    CredentialsProvider({
      credentials
    })
  ]
};


const credentialsConfig: CredentialsConfig = {
  authorize: () => { }
};