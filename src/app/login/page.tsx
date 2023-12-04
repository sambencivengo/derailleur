'use server';
import { redirect } from 'next/navigation';
import { getPageSession } from '~/auth';
import { LogInForm } from '~/components';

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
