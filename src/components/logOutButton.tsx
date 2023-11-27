'use client';
import Link from 'next/link';
import React from 'react';
import { auth } from '~/auth';
import { Button } from '~/components/ui';

export const LogOutButton: React.FC = () => {
  return (
    <Button
      variant={'link'}
      onClick={async () => {
        await fetch('/api/logout', {
          method: 'POST',
        });
      }}
    >
      Log out
    </Button>
  );
};
