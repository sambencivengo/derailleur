'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '~/auth/auth';
import { LogInForm } from '~/components/logInForm';
import { TextHeading } from '~/components/textHeading';
import { LoginAndSignupContainer } from '~/components/loginAndSignupContainer';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect('/');

  return (
    <main>
      <LoginAndSignupContainer>
        <TextHeading heading="Log In" className="italic" />
        <LogInForm />
      </LoginAndSignupContainer>
    </main>
  );
}
