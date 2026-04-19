'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '~/auth/auth';
import { NewPostForm } from '~/components/newPostForm';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/');
  } else {
    return (
      <main>
        <NewPostForm userId={session.user.id} />
      </main>
    );
  }
}
