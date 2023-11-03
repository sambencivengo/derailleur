
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: ,
      clientSecret: ,
    })
  ],

};