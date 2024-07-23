'use server';

import { getUserSessionAndRedirect } from '~/auth';
import { SignUpForm, TextHeading } from '~/components';

export default async function Page() {
  console.log('HERER');
  await getUserSessionAndRedirect();
  return (
    <div className="flex justify-center gap-y-2">
      <div className="flex-col space-y-3">
        <TextHeading heading="Sign Up" className="italic" />
        <SignUpForm />
      </div>
    </div>
  );
}
