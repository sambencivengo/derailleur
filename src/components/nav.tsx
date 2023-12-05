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
          <div>
            <Link href="/">
              <h1 className="text-2xl italic">DERAILLEUR</h1>
            </Link>
          </div>
          <div className="flex space-x-3">
            {session ? (
              <div className="grid grid-flow-col content-center space-x-3">
                <NewPostButton />
                <LogOutButton />
              </div>
            ) : (
              <div className="grid grid-flow-col content-center space-x-3">
                <LogInButton />
                <SignUpButton />
              </div>
            )}
            <ToggleDarkModeButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
