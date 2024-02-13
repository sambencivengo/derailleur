'use server';

import { cn } from '~/lib/utils';

interface HeadingProps {
  heading: string;
  className?: string;
}
export const TextHeading = ({ heading, className }: HeadingProps) => {
  return <p className={cn('text-xl font-bold', className)}>{heading}</p>;
};
