import { v4 as uuid } from 'uuid';
import { BikeIcon, Map, Home, LucideIcon, PlusCircle, Tag } from 'lucide-react';
import Link from 'next/link';
import { ReactElement } from 'react';
import { SheetClose } from '~/components/ui';

const sideBarButtons: Array<{ icon: ReactElement<LucideIcon>; label: string; href: string }> = [
  { icon: <Home />, label: 'Home', href: '/' },
  { icon: <PlusCircle />, label: 'New Post', href: '/post/new' },
  { icon: <Map />, label: 'Routes', href: '/category/routes' },
  { icon: <BikeIcon />, label: 'Trips', href: '/category/trips' },
  { icon: <Tag />, label: 'All Tags', href: '/tags' },
];

interface SideBarButtonsProps {
  closeSheet: boolean;
}
export async function SideBarButtons({ closeSheet = false }: SideBarButtonsProps) {
  return (
    <div className="w-56 flex justify-center flex-col gap-4 ">
      {sideBarButtons.map(({ icon, label, href }) => {
        return (
          <div key={uuid()} className="w-full ml-10 flex justify-center">
            {closeSheet ? (
              <SheetClose asChild>
                <Link href={href} className="w-full hover:text-primary h-10 flex flex-row items-center font-semibold gap-2">
                  {icon} {label}
                </Link>
              </SheetClose>
            ) : (
              <Link href={href} className="w-full hover:text-primary h-10 flex flex-row items-center font-semibold gap-2">
                {icon} {label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
