'use server';
import { getUserSessionAndRedirect } from '~/auth';
import { LogInForm, TextHeading } from '~/components';
import { LoginAndSignupContainer } from '~/components/loginAndSignupContainer';

export default async function Page() {
  await getUserSessionAndRedirect();

  return (
    <main>
      <LoginAndSignupContainer>
        <TextHeading heading="Log In" className="italic" />
        <LogInForm />
      </LoginAndSignupContainer>
    </main>
  );
}
