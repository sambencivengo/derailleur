'use client';
import Link from 'next/link';
import React from 'react';
import { Button } from '~/components/ui';

export const LogOutButton: React.FC = () => {
  return (
    <Button variant={'link'}>
      <Link href={'/signup'}>Sign up</Link>
    </Button>
  );
};
