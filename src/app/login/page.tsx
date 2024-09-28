'use server';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { getUserSessionAndRedirect } from '~/auth';
import { LogInForm, TextHeading } from '~/components';
import { LoginAndSignupContainer } from '~/components/loginAndSignupContainer';
import { Button, Separator } from '~/components/ui';

export default async function Page() {
  await getUserSessionAndRedirect();

  return (
    <main>
      <LoginAndSignupContainer>
        <TextHeading heading="Log In" className="italic" />
        <LogInForm />
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <a className="w-full flex justify-center" href={'api/login/github'}>
            <Button className="flex gap-2" variant={'secondary'}>
              <Github /> Continue with GitHub
            </Button>
          </a>
          <Link className="text-primary hover:underline italic self-center" href={'/signup'}>
            Need to create an account?{' '}
          </Link>
        </div>
      </LoginAndSignupContainer>
    </main>
  );
}
