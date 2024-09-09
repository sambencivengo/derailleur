import Link from 'next/link';
import React from 'react';
import { cn } from '~/lib/utils';

interface LogInButtonProps {
  forMobile?: boolean;
}
export function LogInButton({ forMobile }: LogInButtonProps) {
  return (
    <Link href={'/login'} className={cn(forMobile ? 'rounded-sm h-10 flex justify-center items-center text-2xl font-bold' : 'text-primary hover:underline', 'italic')}>
      Log In
    </Link>
  );
}
