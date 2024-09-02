import { CenterLayout } from '~/components/layouts/centerLayout';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CenterLayout>
      {/* <div className="left-layout"></div> */}
      <div className="center-layout">{children}</div>
      {/* <div className="right-layout"></div> */}
    </CenterLayout>
  );
}
