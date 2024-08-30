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
          <div className="w-full mb-5 mt-5 flex justify-around">
            {/* NOTE: placeholder div for future sidebar content */}
            {/* <div className="p-5 hidden md:block w-3/12 "></div> */}
            <div className="w-full sm:w-8/12 md:w-6/12 max-w-3xl px-1">{children}</div>
            {/* TODO: move this out, it should live in a nested layout and not at the base layer */}
            {/* <RightSideLayoutContainer />  */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
