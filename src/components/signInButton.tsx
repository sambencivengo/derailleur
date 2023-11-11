import { signIn } from 'next-auth/react';
import React from 'react';
import { Button } from '~/components/ui';

export const SignInButton: React.FC = () => {
  return <Button onClick={() => signIn()}>Sign In</Button>;
};
