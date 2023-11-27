'use client';
import Link from 'next/link';
import React from 'react';
import { Button } from '~/components/ui';

export const LogInButton: React.FC = () => {
  return (
    <Button variant={'link'}>
      <Link href={'/login'}>Log in</Link>
    </Button>
  );
};
