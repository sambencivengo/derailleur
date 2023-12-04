import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { Post } from '~/types';
import { getPageSession } from '~/auth';
import { Container } from '~/components/ui';

export default async function Home() {
  const session = await getPageSession();
  return (
    <main>
      {session ? <h1>SESSION EXISTS. Username: {session.user.username}</h1> : <h1 className="text-rose-500">NO SESSION</h1>}
      <div>
        <div className="flex gap-6 py-6"></div>
      </div>
    </main>
  );
}
