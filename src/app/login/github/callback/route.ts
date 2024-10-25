import { v4 as uuid } from 'uuid';
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { auth } from "~/auth";
import { createNextResponse, responseIsOk } from "~/utils";
import { getGithubUserAndVerifyEmail } from "~/app/login/github/callback/getGithubUserAndVerifyEmail";
import { createUserAndOAuthAccountInTransaction } from '~/queries/users/createUserAndOAuthAccountInTransaction';
import { getOAuthAccountByProviderUserId } from '~/queries/oAuthAccounts/getOAuthAccountByProviderUserId';
import { URL } from 'url';
import { NextResponse } from 'next/server';


export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
      headers: {
        Location: "/login",
      }
    });
  }

  try {
    // validate with github
    const githubUserAndEmailResponse = await getGithubUserAndVerifyEmail(code);
    if (!responseIsOk(githubUserAndEmailResponse)) {
      return createNextResponse({ errors: githubUserAndEmailResponse.errors, status: 400 });
    }

    const githubUser = githubUserAndEmailResponse.result;
    const existingOAuthAccountResponse = await getOAuthAccountByProviderUserId({ providerId: 'github', providerUserId: githubUser.id.toString() });
    // Error during account query, return errors
    if (existingOAuthAccountResponse.errors.length > 0) {
      return createNextResponse({ errors: existingOAuthAccountResponse.errors, status: 400 });
    }
    // Account doesn't exist but query was successful, we want to create a user and oAuthAccount
    if (existingOAuthAccountResponse.result === null) {
      const userId = uuid();
      const oAuthAccountId = uuid();
      const userAndOAuthResponse = await createUserAndOAuthAccountInTransaction({ email: githubUser.email, providerId: 'github', providerUserId: githubUser.id, oAuthAccountId, userId });
      if (!responseIsOk(userAndOAuthResponse)) {
        return createNextResponse({ errors: userAndOAuthResponse.errors, status: 400 });
      }
      // User and associated OAuth account created, proceed
      const { oAuthAccount, user } = userAndOAuthResponse.result;
      await setOAuthAccountSession(user.id);
      return createNextResponse({ result: { user, oAuth: oAuthAccount }, status: 200 });
    }

    // Existing account exists, create session for it
    const oAuthAccount = existingOAuthAccountResponse.result;
    await setOAuthAccountSession(oAuthAccount.userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
    // return createNextResponse({ result: { oAuth: oAuthAccount }, status: 200 });

  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
}

async function setOAuthAccountSession(userId: string) {
  const session = await auth.createSession(userId, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}