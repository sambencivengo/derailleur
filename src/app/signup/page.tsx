'use server';
import { redirect } from 'next/navigation';
import * as context from 'next/headers';
import { auth } from '~/auth';
import { SignUpForm } from '~/components/signUpForm';

export default async function Page() {
  const authRequest = auth.handleRequest('GET', context);
  const session = await authRequest.validate();
  if (session) redirect('/');
  return (
    <div className="flex flex-col gap-y-2">
      <h1>Sign Up</h1>
      <SignUpForm />
    </div>
  );
}
