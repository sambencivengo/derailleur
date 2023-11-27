'use server';
import React from 'react';
import { LogInButton, SignUpButton, ToggleDarkModeButton } from '~/components';
import Link from 'next/link';
import { getPageSession } from '~/auth';
import { LogOutButton } from '~/components/logOutButton';

export async function Nav() {
  const session = await getPageSession();

  return (
    <header>
      <nav>
        <div className="flex items-center justify-between p-2 border-b-2">
          <div>
            <Link href="/">
              <h1 className="text-2xl">DERAILLEUR</h1>
            </Link>
          </div>
          <div className="flex">
            {session ? (
              <LogOutButton />
            ) : (
              <>
                <LogInButton />
                <SignUpButton />
              </>
            )}
            <ToggleDarkModeButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
