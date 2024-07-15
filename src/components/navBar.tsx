'use server';
import { DesktopNav } from '~/components';
import Link from 'next/link';
import { getUserSession } from '~/auth';
import { TextHeading, MobileNav } from '~/components';

export async function NavBar() {
  const user = await getUserSession();
  return (
    <header className="w-full sticky md:relative top-0 bg-background">
      <nav>
        <div className="flex items-center justify-between h-12 px-2 border-b-2">
          <div className="pl-2">
            <Link href="/">
              <TextHeading heading="DERAILLEUR" className="text-2xl" italicAnimate={true} />
            </Link>
          </div>

          <DesktopNav user={user} />

          <MobileNav user={user} />
        </div>
      </nav>
    </header>
  );
}
