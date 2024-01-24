'use server';
import { getUserSessionAndRedirect } from '~/auth';
import { LogInForm } from '~/components';

export default async function Page() {
  await getUserSessionAndRedirect();

  return (
    <main>
      <div className="flex justify-center">
        <div className="flex-col space-y-3">
          <h1>Log in</h1>
          <LogInForm />
        </div>
      </div>
    </main>
  );
}
