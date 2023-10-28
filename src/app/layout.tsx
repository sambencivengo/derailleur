import './styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '../components/themeProvider';
import Nav from '../components/nav';

export const metadata: Metadata = {
  title: 'Derailleur',
  description: 'A application for bike enthusiasts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // NOTE: suppressHydrationWarning comes from shadcn dark mode/theme implementation
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          <div className="p-2">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
