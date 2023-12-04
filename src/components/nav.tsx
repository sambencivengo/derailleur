'use server';
import React from 'react';
import { LogInButton, NewPostButton, SignUpButton, ToggleDarkModeButton } from '~/components';
import { getPageSession } from '~/auth';
import { LogOutButton } from '~/components/logOutButton';
import Link from 'next/link';

export async function Nav() {
  const session = await getPageSession();
  return (
    <header>
      <nav>
        <div className="flex items-center justify-between p-2 border-b-2">
          <div className="flex flex-row space-x-3">
            <Link href="/">
              <h1 className="text-2xl">DERAILLEUR</h1>
            </Link>
          </div>
          <div className="flex">
            {session ? (
              <>
                <NewPostButton />
                <LogOutButton />
              </>
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
