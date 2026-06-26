import { headers } from 'next/headers';
import { auth } from '~/auth/auth';
import { v4 as uuid } from 'uuid';
import { BikeIcon, Map, Home, LucideIcon, PlusCircle, Tag, Store, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { ReactElement } from 'react';
import { SheetClose } from '~/components/ui';

interface SideBarButtonsProps {
  closeSheet?: boolean;
}
export async function SideBarButtons({ closeSheet = false }: SideBarButtonsProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user.username ? { id: session.user.id, username: session.user.username } : null;

  const sideBarButtons: Array<{ icon: ReactElement<LucideIcon>; label: string; href: string }> = [
    { icon: <Home />, label: 'Home', href: '/' },
    { icon: <PlusCircle />, label: 'New Post', href: '/post/new' },
    { icon: <Map />, label: 'Routes', href: '/category/routes' },
    { icon: <BikeIcon />, label: 'Trips', href: '/category/trips' },
    { icon: <Tag />, label: 'All Tags', href: '/tags' },
    { icon: <Store />, label: 'Market', href: '/market' },
    // TODO: update username in the saved route
    { icon: <Bookmark />, label: 'Saved Posts', href: `user/${user?.username}/saved` }
  ];
  return (
    <div className="sticky top-5 w-56 flex justify-center flex-col gap-4">
      {sideBarButtons.map(({ icon, label, href }) => {
        return (
          <div key={uuid()} className="ml-10">
            {closeSheet ? (
              <SheetClose asChild>
                <Link href={href} className="hover:text-primary h-10 flex flex-row items-center font-semibold gap-2">
                  {icon} {label}
                </Link>
              </SheetClose>
            ) : (
              <Link href={href} className="hover:bg-card w-auto p-4  h-10 flex flex-row items-center font-semibold gap-2">
                {icon} {label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
