import { ClassValue } from 'clsx';
import React from 'react';
import { cn } from '~/lib/utils';

interface SideBarLayoutProps {
  children: React.ReactNode;
  className?: ClassValue;
  side: 'left' | 'right';
}

export function SideBarLayout({ children, className, side }: SideBarLayoutProps) {
  return <div className={cn(side === 'left' ? 'left-layout' : 'right-layout', className)}>{children}</div>;
}
