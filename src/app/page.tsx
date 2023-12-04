import React from 'react';
import { getPageSession } from '~/auth';
import { FrontPagePostContainer } from '~/components';

import { getPosts } from '~/queries';

export default async function Home() {
  const session = await getPageSession();
  const posts = await getPosts();

  return (
    <main>
      {session ? <h1>SESSION EXISTS. Username: {session.user.username}</h1> : <h1 className="text-rose-500">NO SESSION</h1>}
      <FrontPagePostContainer postsResponse={posts} />
    </main>
  );
}
