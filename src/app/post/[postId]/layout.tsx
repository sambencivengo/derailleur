import { MainLayout } from '~/components/layouts/mainLayout';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {/* <div className="left-layout"></div> */}
      <div className="w-full">{children}</div>
      {/* <div className="right-layout"></div> */}
    </MainLayout>
  );
}
