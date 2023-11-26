'use client';
import React from 'react';
import { ToggleDarkModeButton } from '~/components';
import { Button } from './ui';
import Link from 'next/link';

export function Nav() {
  return (
    <header>
      <nav>
        <div className="flex items-center justify-between p-2 border-b-2">
          <div>
            <a
              className="pointer-events-none flex place-items-center gap-2"
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h1 className="text-2xl">DERAILLEUR</h1>
            </a>
          </div>
          <div className="flex">
            <Button variant={'link'}>
              <Link href={'/login'}>Log in</Link>
            </Button>
            <Button variant={'link'}>
              <Link href={'/signup'}>Sign up</Link>
            </Button>
            <ToggleDarkModeButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
