'use server';
import { getUserSessionAndRedirect } from '~/auth';
import { LogInForm, TextHeading } from '~/components';

export default async function Page() {
  await getUserSessionAndRedirect();

  return (
    <main>
      <div className="flex justify-center">
        <div className="flex-col space-y-3">
          <TextHeading heading="Log In" className="italic" />
          <LogInForm />
        </div>
      </div>
    </main>
  );
}
