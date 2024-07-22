import './styles/globals.css';
import { Inter as FontSans } from 'next/font/google';
import type { Metadata } from 'next';
import { cn } from '~/lib/utils';
import { NavBar, ThemeProvider } from '~/components';
import { Toaster } from '~/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Derailleur',
  description: 'An application for bike enthusiasts',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // NOTE: suppressHydrationWarning comes from shadcn dark mode/theme implementation
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Toaster />
          <NavBar />
          <div className="my-5 px-5 lg:px-56 xl:px-96 md:px-24 sm:px-14">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
