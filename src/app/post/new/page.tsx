'use server';

import { redirect } from 'next/navigation';
import { getPageSession } from '~/auth';
import { NewPostForm } from '~/components';

export default async function Page() {
  const session = await getPageSession();
  if (session === null) {
    return redirect('/');
  }
  return (
    <main>
      <NewPostForm userId={session.user.userId} username={session.user.username} />
    </main>
  );
}
