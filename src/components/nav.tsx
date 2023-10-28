import { ToggleDarkModeButton } from './ui/toggleDarkModeButton';

export default function Nav() {
  return (
    <header>
      <nav>
        <div className="flex items-center justify-between">
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
            <ToggleDarkModeButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
