import './styles/globals.css';
import { Geist_Mono, JetBrains_Mono } from 'next/font/google';
import { cn } from '~/lib/utils';
import { ThemeProvider } from '~/components/themeProvider';
import { NavBar } from '~/components/navBar';
import { Toaster } from '~/components/ui/toaster';
import { Metadata } from 'next';

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'Derailleur',
  description: 'An application for bike enthusiasts',
};
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    // NOTE: suppressHydrationWarning comes from shadcn dark mode/theme implementation
    <html lang="en" suppressHydrationWarning className={cn(geistMono.variable, jetbrainsMono.variable)}>
      <body className={cn('min-h-screen w-full bg-background font-sans antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Toaster />
          <NavBar />
          <div className="w-full mb-5 mt-5">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
