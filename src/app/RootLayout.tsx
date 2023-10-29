import { cn } from '../lib/utils';
import { fontSans } from './layout';
import { Nav, ThemeProvider } from '@/components';

export default function RootLayout({
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          <div className="p-2">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
