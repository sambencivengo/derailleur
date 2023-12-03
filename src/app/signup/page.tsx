'use server';
import { redirect } from 'next/navigation';
import * as context from 'next/headers';
import { auth, getPageSession } from '~/auth';
import { SignUpForm } from '~/components';

export default async function Page() {
  const session = await getPageSession();
  if (session) redirect('/');
  return (
    <div className="flex flex-col gap-y-2">
      <h1>Sign Up</h1>
      <SignUpForm />
    </div>
  );
}
