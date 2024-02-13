'use server';
import React from 'react';
import { LogInButton, NewPostButton, SignUpButton, ToggleDarkModeButton } from '~/components';
import { LogOutButton } from '~/components/logOutButton';
import Link from 'next/link';
import { getUserSession } from '~/auth';
import { TextHeading, MobileNav } from '~/components';

export async function Nav() {
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
          <div className="hidden md:flex gap-3">
            {user ? (
              <div className="grid grid-flow-col content-center gap-3">
                <NewPostButton />
                <LogOutButton />
              </div>
            ) : (
              <div className="grid grid-flow-col content-center gap-3">
                <LogInButton />
                <SignUpButton />
              </div>
            )}
            <ToggleDarkModeButton />
          </div>
          {/* MOBILE NAV */}
          <div className="flex md:hidden pr-2">{<MobileNav />}</div>
        </div>
      </nav>
    </header>
  );
}
