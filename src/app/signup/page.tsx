'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '~/auth/auth';
import { TextHeading } from '~/components/textHeading';
import { SignUpForm } from '~/components/signUpForm';
import { LoginAndSignupContainer } from '~/components/loginAndSignupContainer';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect('/');
  return (
    <main>
      <LoginAndSignupContainer>
        <TextHeading heading="Sign Up" className="italic" />
        <SignUpForm />
      </LoginAndSignupContainer>
    </main>
  );
}
