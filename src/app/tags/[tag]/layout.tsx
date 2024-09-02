import '../../styles/globals.css';
import { cn } from '~/lib/utils';
import { NavBar, ThemeProvider } from '~/components';
import { Toaster } from '~/components/ui/toaster';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    // NOTE: suppressHydrationWarning comes from shadcn dark mode/theme implementation
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Toaster />
          <NavBar />
          <div className="w-full min-h-screen mb-5 mt-5 flex justify-around">
            <div className="w-full sm:w-11/12  max-w-3xl px-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}