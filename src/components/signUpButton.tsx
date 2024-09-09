import Link from 'next/link';
import React from 'react';
import { Button } from '~/components/ui';

interface SignUpButtonProps {
  forMobile?: boolean;
}
export function SignUpButton({ forMobile }: SignUpButtonProps) {
  return (
    <Link href={'/signup'}>
      <Button className="w-full">Sign Up</Button>
    </Link>
  );
}
