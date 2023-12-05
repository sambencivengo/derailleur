'use client';
import Link from 'next/link';
import React from 'react';

export const LogInButton: React.FC = () => {
  return (
    <Link className="text-primary italic hover:underline" href={'/login'}>
      Log in
    </Link>
  );
};
