import { DialogClose } from '@radix-ui/react-dialog';
import Link from 'next/link';
import React from 'react';
import { Button } from '~/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';

interface NewPostLoginDialogProps {
  children: React.ReactNode;
}
export function NewPostLoginDialog({ children }: NewPostLoginDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary italic text-3xl">DERAILLEUR</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 text-xl font-semibold">Welcome to Derailleur! Log in or create an account to join the conversation.</div>
        <div className="flex flex-col w-full justify-center gap-2">
          <DialogClose asChild>
            <Link href="/signup" className="w-full">
              <Button className="w-full font-bold">Create account</Button>
            </Link>
          </DialogClose>
          <DialogClose asChild>
            <Link href="/login" className="w-full">
              <Button className="w-full font-bold hover:bg-transparent" variant={'outline'}>
                Log in
              </Button>
            </Link>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
