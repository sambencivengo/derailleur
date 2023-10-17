'use client';
import Image from 'next/image';
import { ToggleDarkModeButton } from './ui/toggleDarkModeButton';

export default function Nav() {
  return (
    <header>
      <nav>
        <ul className="flex items-center justify-between">
          <li>
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
          </li>
          <li>
            <ToggleDarkModeButton />
          </li>
        </ul>
      </nav>
    </header>
  );
}
