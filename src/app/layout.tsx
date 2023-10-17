import './styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '../components/themeProvider';

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
    <html lang="en">
      <body className="p-5">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
