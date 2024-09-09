import Link from 'next/link';
import React from 'react';
import { cn } from '~/lib/utils';

interface SignUpButtonProps {
  forMobile?: boolean;
}
export function SignUpButton({ forMobile }: SignUpButtonProps) {
  return (
    <Link className={cn(forMobile ? 'rounded-sm h-10 flex justify-center items-center text-2xl font-bold' : 'text-primary hover:underline', 'italic')} href={'/signup'}>
      Sign Up
    </Link>
  );
}
