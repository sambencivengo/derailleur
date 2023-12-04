'use server';
import { redirect } from 'next/navigation';
import { getPageSession } from '~/auth';
import { SignUpForm } from '~/components';

export default async function Page() {
  const session = await getPageSession();
  if (session) redirect('/');
  return (
    <div className="flex justify-center gap-y-2">
      <div className="flex-col space-y-3">
        <h1>Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
