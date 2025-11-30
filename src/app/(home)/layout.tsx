import { CenterLayout } from '../../components/layouts/centerLayout';
import { MainLayout } from '../../components/layouts/mainLayout';

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <MainLayout>
      <CenterLayout className="center-layout">{children}</CenterLayout>
    </MainLayout>
  );
  //return (
  //  <MainLayout>
  //    <SideBarLayout side="left">
  //      <SideBarButtons />
  //    </SideBarLayout>
  //    <CenterLayout className="center-layout">{children}</CenterLayout>
  //    <SideBarLayout side="right">
  //      <TopUsers />
  //    </SideBarLayout>
  //  </MainLayout>
  //);
}
