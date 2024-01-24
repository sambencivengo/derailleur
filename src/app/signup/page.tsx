'use server';

import { getUserSessionAndRedirect } from '~/auth';
import { SignUpForm } from '~/components';

export default async function Page() {
  await getUserSessionAndRedirect();
  return (
    <div className="flex justify-center gap-y-2">
      <div className="flex-col space-y-3">
        <h1>Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
