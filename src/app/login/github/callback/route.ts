import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { auth, gitHubOAuth } from "~/auth";
import { createUser } from "~/queries";
import { generateUserNameFromEmail } from "~/utils/generateUsername";
import { createNextResponse, responseIsOk } from "~/utils";
import { getUserByEmailForOAuthLink } from "~/queries/users/getUserByEmailForOAuthLink";
import { getGithubUserAndVerifyEmail } from "~/app/login/github/callback/getGithubUserAndVerifyEmail";

interface GitHubUser {
  id: string;
  login: string;
  email: string;
}

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

    // Check if user is already in database
    const existingUserResponse = await getUserByEmailForOAuthLink(githubUser.email);
    console.log({ existingUserResponse });

    if (existingUserResponse.errors.length > 0) {
      return createNextResponse({ errors: existingUserResponse.errors, status: 400 });
    }
    if (!existingUserResponse.result) {
      // create a new user
      const newUserResponse = await createUser({ favoriteBikes: [], username: generateUserNameFromEmail(githubUser.email), email: githubUser.email, });
      if (!responseIsOk(newUserResponse)) {
        return createNextResponse({ errors: newUserResponse.errors, status: 400 });
      }
      const { result } = newUserResponse;

      // TODO: connect user account to a new OAuth account link
      return createNextResponse({ errors: newUserResponse.errors, status: 400 });
    }

    const existingUser = existingUserResponse.result;
    const session = await auth.createSession(existingUser.id, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
    // return new Response(null, {
    //   status: 302,
    //   headers: {
    //     Location: "/"
    //   }
    // });


    // TODO: catch the user creation separately.
    // if user is not created, we cannot connect to oAuth login and should not proceed, send error to FE

    // If execution reaches here, TypeScript knows that result is not null

    // user email from oAuth will be save on user when created, we check for teh email fist



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

