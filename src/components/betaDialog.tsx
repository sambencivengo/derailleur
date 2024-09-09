'use client';

import Link from 'next/link';
import { DialogHeader, DialogTrigger, Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui';

export function BetaDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Link href={''} className="italic text-sm font-semibold text-primary hover:text-green-500">
          beta
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary italic text-3xl">beta</DialogTitle>
        </DialogHeader>
        <DialogDescription>Derailleur is currently in beta. </DialogDescription>
        <div className="flex items-center space-x-2">Please note that any accounts or posts made may not be preserved when Derailleur enters 1.0.</div>
      </DialogContent>
    </Dialog>
  );
}
