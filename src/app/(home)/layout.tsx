import { BikeIcon, Home, LucideIcon, Map, PlusCircle, Tag } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import { TopUsers } from '~/components/TopUsers';
import { ReactElement } from 'react';
import { MainLayout } from '~/components/layouts/mainLayout';

const sideBarButtons: Array<{ icon: ReactElement<LucideIcon>; label: string; href: string }> = [
  { icon: <Home />, label: 'Home', href: '/' },
  { icon: <PlusCircle />, label: 'New Post', href: '/post/new' },
  { icon: <Map />, label: 'Routes', href: '/category/routes' },
  { icon: <BikeIcon />, label: 'Trips', href: '/category/trips' },
  { icon: <Tag />, label: 'All Tags', href: '/tags' },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <div className="left-layout">
        <div className="w-56 flex justify-center flex-col gap-4 ">
          {sideBarButtons.map(({ icon, label, href }) => {
            return (
              <div key={uuid()} className="w-full ml-10 flex justify-center">
                <Link href={href} className="w-full hover:text-primary h-10 flex flex-row items-center font-semibold gap-2">
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
    </MainLayout>
  );
}
