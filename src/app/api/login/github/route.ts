import { generateState } from "arctic";
import { cookies } from "next/headers";
import { gitHubOAuth } from "~/auth";

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = await gitHubOAuth.createAuthorizationURL(state, {
    scopes: ["user:email"],
  });

  cookies().set("github_oauth_state", state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax'
  });

  return Response.redirect(url);
}