'use client';
import Link from 'next/link';
import React from 'react';

export const SignUpButton: React.FC = () => {
  return (
    <Link className="text-primary italic hover:underline" href={'/signup'}>
      Sign up
    </Link>
  );
};
