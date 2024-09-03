import { TopUsers } from '~/components/TopUsers';
import { CenterLayout } from '~/components/layouts/centerLayout';
import { MainLayout } from '~/components/layouts/mainLayout';
import { SideBarLayout } from '~/components/layouts/rightLayout';
import { SideBarButtons } from '~/components/sideBarButtons';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <SideBarLayout side="left">
        <SideBarButtons />
      </SideBarLayout>
      <CenterLayout className="center-layout">{children}</CenterLayout>
      <SideBarLayout side="right">
        <TopUsers />
      </SideBarLayout>
    </MainLayout>
  );
}
