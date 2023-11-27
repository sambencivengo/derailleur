import { cache } from "react";
import * as context from 'next/headers';
import { auth } from "~/auth/lucia";

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});