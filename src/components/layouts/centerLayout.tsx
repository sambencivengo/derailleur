import { ClassValue } from 'clsx';
import React from 'react';
import { cn } from '~/lib/utils';

interface CenterLayoutProps {
  children: React.ReactNode;
  className?: ClassValue;
}

export function CenterLayout({ children, className }: CenterLayoutProps) {
  return <div className={cn('center-layout', className)}>{children}</div>;
}
