import Link from 'next/link';
import { getUserSession } from '~/auth';
import { TextHeading } from '~/components';
import { CenterLayout } from '~/components/layouts/centerLayout';
import { cn } from '~/lib/utils';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { [username: string]: string };
}
export default async function RootLayout({ children, params }: ProfileLayoutProps) {
  const user = await getUserSession();
  const { username } = params;
  const userIsLoggedIn = user !== null && user.username === username;
  return (
    <CenterLayout>
      {/* <div className="left-layout"></div> */}
      <div className="w-full flex justify-center">
        <div className="center-layout">
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
      </div>
      ;{/* <div className="right-layout"></div> */}
    </CenterLayout>
  );
}
