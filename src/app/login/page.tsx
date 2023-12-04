'use server';
import { redirect } from 'next/navigation';
import { getPageSession } from '~/auth';
import { LogInForm } from '~/components';

export default async function Page() {
  const session = await getPageSession();
  if (session) redirect('/');

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
