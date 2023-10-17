'use client';
import Image from 'next/image';
import { ToggleDarkModeButton } from './ui/toggleDarkModeButton';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

export default function Nav() {
  return (
    <header>
      <nav>
        <div className="flex items-center justify-between">
          <div>
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8"
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
          <div>
            <ToggleDarkModeButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
