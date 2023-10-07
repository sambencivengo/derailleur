import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers/providers';

export const metadata: Metadata = {
  title: 'Derailleur',
  description: 'An cyclists and adventures.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
