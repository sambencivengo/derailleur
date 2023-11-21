'use client';
import Link from 'next/link';
import React from 'react';
import { ToggleDarkModeButton } from '~/components';
import { Button } from './ui';
import { signIn } from 'next-auth/react';

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
            <Button variant={'link'} onClick={() => signIn()}>
              Sign In
            </Button>
            <ToggleDarkModeButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
