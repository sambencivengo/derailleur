'use server';

import { redirect } from 'next/navigation';
import { getUserSession, getUserSessionAndRedirect } from '~/auth';
import { NewPostForm } from '~/components';

export default async function Page() {
  const userSession = await getUserSession();
  if (!userSession) {
    redirect('/');
  }
  return (
    <main>
      <NewPostForm />
    </main>
  );
}
