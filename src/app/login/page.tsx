'use server';
import { getUserSessionAndRedirect } from '~/auth/getUserSession';
import { LogInForm } from '~/components/logInForm';
import { TextHeading } from '~/components/textHeading';
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
