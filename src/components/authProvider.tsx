'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

type AuthProviderProps = {
  children?: React.ReactNode;
  session: Session | null;
};
export const AuthProvider = async ({
  children,
  session,
}: AuthProviderProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
