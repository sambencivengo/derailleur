'use server';

import { redirect } from 'next/navigation';
import { getUserSession } from '~/auth/getUserSession';
import { NewPostForm } from '~/components/newPostForm';

export default async function Page() {
  const userWithSession = await getUserSession();
  if (!userWithSession) {
    redirect('/');
  } else {
    return (
      <main>
        <NewPostForm userId={userWithSession.userId} />
      </main>
    );
  }
}
