import { ClassValue } from 'clsx';
import React from 'react';
import { cn } from '~/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: ClassValue;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return <div className={cn('w-full flex justify-center', className)}>{children}</div>;
}
