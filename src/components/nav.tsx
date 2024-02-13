'use server';
import React from 'react';
import { LogInButton, NewPostButton, SignUpButton, ToggleDarkModeButton } from '~/components';
import { LogOutButton } from '~/components/logOutButton';
import Link from 'next/link';
import { getUserSession } from '~/auth';

export async function Nav() {
  const user = await getUserSession();

  return (
    <header>
      <nav>
        <div className="flex items-center justify-between p-2 border-b-2">
          <div>
            <Link href="/">
              <h1 className="text-2xl italic font-bold">DERAILLEUR</h1>
            </Link>
          </div>
          <div className="flex space-x-3">
            {user ? (
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
