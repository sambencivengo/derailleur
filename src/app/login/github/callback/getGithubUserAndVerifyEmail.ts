import { GitHubTokens } from "arctic";
import { gitHubOAuth } from "~/auth";
import { createDerailleurError, createErrorResponse, createSuccessfulResponse, DerailleurResponse, responseIsOk } from "~/utils";


interface GitHubUser {
  id: string;
  login: string;
  email: string;
}

interface GithubEmail {
  email: string,
  verified: boolean,
  primary: boolean,
  visibility: string;
}
export async function getGithubUserAndVerifyEmailWithOAuth(code: string): Promise<DerailleurResponse> {
  const tokens = await gitHubOAuth.validateAuthorizationCode(code);

  const githubUserResponse = await getGithubUser(tokens);
  if (!responseIsOk(githubUserResponse)) {
    return (githubUserResponse);
  }

  const verifiedEmailResponse = await userHasVerifiedEmail(tokens);
  if (!responseIsOk(verifiedEmailResponse)) {
    return (verifiedEmailResponse);
  }
  const { email } = verifiedEmailResponse.result;
  return createSuccessfulResponse<GitHubUser>({ ...githubUserResponse.result, email });
};

export async function getGithubUser(tokens: GitHubTokens): Promise<DerailleurResponse<GitHubUser>> {
  try {
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    return createSuccessfulResponse(githubUser);
  } catch (error) {
    return createErrorResponse([createDerailleurError('Unable to retrieve GitHub user', {})]);
  }
}
export async function userHasVerifiedEmail(tokens: GitHubTokens): Promise<DerailleurResponse<GithubEmail>> {

  try {
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const emails: GithubEmail[] = await emailsResponse.json();
    const primaryEmail = emails.find((email) => email.primary) ?? null;

    if (!primaryEmail) {
      return createErrorResponse([createDerailleurError('Unable to find a primary email for GitHub account', {})]);
    }
    if (!primaryEmail.verified) {
      return createErrorResponse([createDerailleurError('Primary email on GitHub account is not verified', {})]);
    }

    return createSuccessfulResponse(primaryEmail);
  } catch (error: any) {
    return createErrorResponse([createDerailleurError(error.toString(), {}), createDerailleurError('An error occurred while attempting to retrieve a verified email for the GitHub user', {})]);
  }
}