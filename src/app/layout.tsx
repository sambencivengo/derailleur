import './styles/globals.css';
import { Inter as FontSans } from 'next/font/google';
import type { Metadata } from 'next';
import { Nav, ThemeProvider } from '~/components';
import { cn } from '~/lib/utils';
import { AuthProvider } from '~/components/authProvider';
import { getServerSession } from 'next-auth';

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
  const session = await getServerSession();
  return (
    // NOTE: suppressHydrationWarning comes from shadcn dark mode/theme implementation
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Nav />
            <div className="p-2">{children}</div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
