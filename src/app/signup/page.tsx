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
    <div className="flex flex-col justify-center">
      <h1>Sign Up</h1>
      {/* <OldForm action="/api/signup">
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <Button type="submit">Sign In</Button>
      </OldForm> */}
      <SignUpForm />
    </div>
  );
}
