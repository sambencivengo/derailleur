'use server';

import { getUserSessionAndRedirect } from '~/auth';
import { NewPostForm } from '~/components';

export default async function Page() {
  await getUserSessionAndRedirect('/', true);
  return (
    <main>
      <NewPostForm />
    </main>
  );
}
