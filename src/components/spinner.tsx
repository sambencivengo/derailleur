import { ClassValue } from 'clsx';
import { Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';

export function Spinner({ className }: { className?: ClassValue }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin', className)} />;
}
