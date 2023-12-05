import { cache } from "react";
import * as context from 'next/headers';
import { auth } from "~/auth/lucia";
import { UserSession } from "~/types/models/sessions";

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  const sessionObject: Promise<UserSession | null> = authRequest.validate();
  return sessionObject;
});