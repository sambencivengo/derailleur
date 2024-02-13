'use server';
import Link from 'next/link';
import { Button, Sheet, SheetClose, SheetContent, SheetTrigger } from '~/components/ui';

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <div className="grid grid-flow-col content-center gap-3">
          <SheetClose asChild>
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
