'use server';
import { DesktopNav } from '~/components';
import Link from 'next/link';
import { getUserSession } from '~/auth';
import { TextHeading, MobileNav } from '~/components';

export async function NavBar() {
  const user = await getUserSession();

  return (
    <header>
      <nav>
        <div className="flex items-center justify-between h-12 px-2 border-b-2">
          <div className="pl-2">
            <Link href="/">
              <TextHeading heading="DERAILLEUR" className="italic text-2xl" />
            </Link>
          </div>

          <DesktopNav user={user} />

          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
