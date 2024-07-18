import Link from 'next/link';
import React from 'react';
import { getUserSession } from '~/auth';
import { TextHeading } from '~/components/textHeading';
import { cn } from '~/lib/utils';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { [username: string]: string };
}
export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const user = await getUserSession();
  const { username } = params;
  const userIsLoggedIn = user !== null && user.username === username;
  return (
    <div>
      <TextHeading heading={userIsLoggedIn ? `Hey, @${username}` : username} className="text-2xl" />

      <div className="flex flex-row gap-5 text-lg">
        <Link className={cn('text-primary hover:underline', 'italic')} href={`/user/${username}/posts`}>
          Posts
        </Link>
        <Link className={cn('text-primary hover:underline', 'italic')} href={`/user/${username}/comments`}>
          Comments
        </Link>
        {userIsLoggedIn && (
          <Link className={cn('text-primary hover:underline', 'italic')} href={`/user/${username}/saved`}>
            Saved
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
