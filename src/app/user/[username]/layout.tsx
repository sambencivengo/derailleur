import Link from 'next/link';
import { getUserSession } from '~/auth';
import { TextHeading } from '~/components';
import { CenterLayout } from '~/components/layouts/centerLayout';
import { MainLayout } from '~/components/layouts/mainLayout';
import { cn } from '~/lib/utils';
import { getUserByUsername } from '~/queries';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { [username: string]: string };
}
export default async function RootLayout({ children, params }: ProfileLayoutProps) {
  const user = await getUserSession();
  const { username } = params;
  const userProfile = await getUserByUsername(username);
  console.log(userProfile);

  const userIsLoggedIn = user !== null && user.username === username;
  return (
    <MainLayout>
      <CenterLayout className="w-full flex justify-center">
        <div className="center-layout">
          <Link href={`/user/${username}`} className="flex flex-row gap-2 items-center">
            <TextHeading heading={`@${username}`} className="text-2xl hover:underline text-primary" />
          </Link>

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
      </CenterLayout>
    </MainLayout>
  );
}
