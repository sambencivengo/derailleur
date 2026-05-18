import { MainLayout } from '~/components/layouts/mainLayout';
import { SideBarButtons } from '~/components/sideBarButtons';
import { SideBarLayout } from '~/components/layouts/sideLayout';


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <SideBarLayout side="left">
        <SideBarButtons />
      </SideBarLayout>
      {children}
    </MainLayout>
  );
}
