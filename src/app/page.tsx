import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { auth } from '~/auth/lucia';
import { FrontPagePost } from '~/components/frontPagePost';
import * as context from 'next/headers';
import { Post } from '~/types';

const mockPost: Post = {
  authorId: mockUser_00.id,
  content: 'Lorem ipsum',
  createdAt: new Date('3/4/2020'),
  updatedAt: new Date('3/4/2020'),
  id: 'testId_00',
  published: true,
  title: 'Just picked up this 1991 Trek 990',
};

const mockPosts: Post[] = [
  mockPost,
  mockPost,
  mockPost,
  mockPost,
  mockPost,
  mockPost,
];

export default async function Home() {
  const authRequest = auth.handleRequest('GET', context);
  const session = await authRequest.validate();

  return (
    <main>
      {session && <h1>SESSION EXISTS {session.user.username}</h1>}
      <section className="py-10 flex flex-col items-center gap-4">
        {mockPosts &&
          mockPosts.map((post) => <FrontPagePost post={post} key={post.id} />)}
      </section>
      <div>
        <div className="flex gap-6 py-6"></div>
      </div>
    </main>
  );
}
