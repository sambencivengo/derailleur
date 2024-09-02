import Link from 'next/link';
import '../../styles/globals.css';
import { getUserSession } from '~/auth';
import { NavBar, TextHeading, ThemeProvider } from '~/components';
import { Toaster } from '~/components/ui/toaster';
import { cn } from '~/lib/utils';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { [username: string]: string };
}
export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const user = await getUserSession();
  const { username } = params;
  const userIsLoggedIn = user !== null && user.username === username;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Toaster />
          <NavBar />

          <div className="w-full min-h-screen mb-5 mt-5 flex justify-around">
            <div className="center-layout">
              <TextHeading heading={userIsLoggedIn ? `Hey, @${username}` : username} className="text-2xl" />

              <div className="flex flex-row gap-5 text-lg">
                <Link className={cn('text-primary hover:underline', 'italic')} href={`/user/${username}/posts`}>
                  Posts
                </Link>
                <Link className={cn('text-primary hover:underline', 'italic')} href={`/user/${username}/comments`}>
                  Comments
                </Link>
                {userIsLoggedIn && (
                  <Link className={cn('text-primary hover:underline', 'italic')} href={`/user/${username}/saved`}>
                    Saved
                  </Link>
                )}
              </div>
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

// import { cn } from '~/lib/utils';
// import { NavBar, ThemeProvider } from '~/components';
// import { Toaster } from '~/components/ui/toaster';

// export default async function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     // NOTE: suppressHydrationWarning comes from shadcn dark mode/theme implementation
//     <html lang="en" suppressHydrationWarning>
//       <body className={cn('min-h-screen bg-background font-sans antialiased')}>
//         <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
//           <Toaster />
//           <NavBar />
//           <div className="w-full min-h-screen mb-5 mt-5 flex justify-around">
//             <div className="w-full sm:w-11/12  max-w-3xl px-1">{children}</div>
//           </div>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
