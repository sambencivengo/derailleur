'use server';
import { LogInForm } from '~/components';
import { redirect } from 'next/navigation';
import * as context from 'next/headers';
import { auth, getPageSession } from '~/auth';

export default async function Page() {
  const session = await getPageSession();
  if (session) redirect('/');

  return (
    <div className="flex flex-col gap-y-2">
      <h1>Log in</h1>
      <LogInForm />
    </div>
  );
}
