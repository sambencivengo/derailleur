'use server';

import { getUserSessionAndRedirect } from '~/auth';
import { SignUpForm, TextHeading } from '~/components';
import { LoginAndSignupContainer } from '~/components/loginAndSignupContainer';

export default async function Page() {
  await getUserSessionAndRedirect();
  return (
    <main>
      <LoginAndSignupContainer>
        <TextHeading heading="Sign Up" className="italic" />
        <SignUpForm />
      </LoginAndSignupContainer>
    </main>
  );
}
