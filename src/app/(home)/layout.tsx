import { CenterLayout } from '~/components/layouts/centerLayout';
import { TopUsers } from '~/components/TopUsers';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CenterLayout>
      <div className="left-layout"></div>
      <div className="center-layout">{children}</div>
      <div className="right-layout">
        <TopUsers />
      </div>
    </CenterLayout>
  );
}
