import './styles/globals.css';
import { Inter as FontSans } from 'next/font/google';
import type { Metadata } from 'next';
import { cn } from '~/lib/utils';
import { Nav, ThemeProvider } from '~/components';

export const metadata: Metadata = {
  title: 'Derailleur',
  description: 'A application for bike enthusiasts',
};

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // NOTE: suppressHydrationWarning comes from shadcn dark mode/theme implementation
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <div className="px-5 lg:px-56 md:px-24 sm:px-14">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
