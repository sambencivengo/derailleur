'use server';

import Link from 'next/link';
import { DesktopNav } from '~/components/desktopNav';
import { TextHeading } from '~/components/textHeading';
import { MobileNav } from '~/components/mobileNav';
import { headers } from 'next/headers';
import { auth } from '~/auth/auth';
import { BetaDialog } from '~/components/betaDialog';
import { MobileSideBarButtons } from '~/components/mobileSideBarButtons';

export async function NavBar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user.username ? { id: session.user.id, username: session.user.username } : null;
  return (
    <header className="w-full sticky md:relative top-0 bg-background">
      <nav>
        <div className="flex items-center justify-between h-12 px-2 border-b-2">
          <MobileSideBarButtons />

          <div className="flex flex-row gap-1 pl-2">
            <Link href="/">
              <TextHeading heading="DERAILLEUR" className="text-2xl" italicAnimate={true} />
            </Link>
            <BetaDialog />
          </div>

          <DesktopNav user={user} />

          <MobileNav user={user} />
        </div>
      </nav>
    </header>
  );
}
