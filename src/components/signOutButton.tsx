import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '~/components/ui';

export const SignOutButton: React.FC = () => {
  return <Button onClick={() => signOut()}>Sign Out</Button>;
};
