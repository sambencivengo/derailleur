'use server';
import React from 'react';
import { LogInButton, LogOutButton, ToggleDarkModeButton } from '~/components';
import Link from 'next/link';

export async function Nav() {
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
            <LogInButton />
            <LogOutButton />

            <ToggleDarkModeButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
