export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-center">
      <div className="left-layout"></div>
      <div className="center-layout">{children}</div>
      <div className="right-layout"></div>
    </div>
  );
}
