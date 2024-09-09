import Link from 'next/link';
import React from 'react';
import { Button } from '~/components/ui';

interface LogInButtonProps {
  forMobile?: boolean;
}
export function LogInButton({ forMobile }: LogInButtonProps) {
  return (
    <Link href={'/login'}>
      <Button variant={'secondary'} className="w-full">
        Log In
      </Button>
    </Link>
  );
}
