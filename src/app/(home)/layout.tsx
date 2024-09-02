import { BikeIcon, Home, LucideIcon, Map, PlusCircle } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import { CenterLayout } from '~/components/layouts/centerLayout';
import { TopUsers } from '~/components/TopUsers';
import { ReactElement } from 'react';

const sideBarButtons: Array<{ icon: ReactElement<LucideIcon>; label: string; href: string }> = [
  { icon: <Home />, label: 'Home', href: '/' },
  { icon: <PlusCircle />, label: 'New Post', href: '/post/new' },
  { icon: <Map />, label: 'Routes', href: '/category/routes' },
  { icon: <BikeIcon />, label: 'Trips', href: '/category/trips' },
  // { icon: <Tag />, label: 'All Tags', href: '/category/trips' },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CenterLayout>
      <div className="left-layout">
        <div className="w-56 flex justify-center flex-col gap-4 ">
          {sideBarButtons.map(({ icon, label, href }) => {
            return (
              <div className="w-full ml-10 flex justify-center">
                <Link key={uuid()} href={href} className="w-full hover:text-primary h-10 flex flex-row items-center font-semibold gap-2">
                  {icon} {label}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className="center-layout">{children}</div>
      <div className="right-layout">
        <TopUsers />
      </div>
    </CenterLayout>
  );
}
