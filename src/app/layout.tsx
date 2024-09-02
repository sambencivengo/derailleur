import './styles/globals.css';
import { cn } from '~/lib/utils';
import { NavBar, ThemeProvider } from '~/components';
import { Toaster } from '~/components/ui/toaster';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Derailleur',
  description: 'An application for bike enthusiasts',
};
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    // NOTE: suppressHydrationWarning comes from shadcn dark mode/theme implementation
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen w-full bg-background font-sans antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Toaster />
          <NavBar />
          <div className="w-full min-h-screen mb-5 mt-5 flex justify-around">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
