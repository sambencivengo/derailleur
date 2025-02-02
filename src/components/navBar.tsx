'use server';

import Link from 'next/link';
import { DesktopNav } from '~/components/desktopNav';
import { TextHeading } from '~/components/textHeading';
import { MobileNav } from '~/components/mobileNav';
import { getUserSession } from '~/auth/getUserSession';
import { BetaDialog } from '~/components/betaDialog';
import { MobileSideBarButtons } from '~/components/mobileSideBarButtons';

export async function NavBar() {
  const user = await getUserSession();
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
