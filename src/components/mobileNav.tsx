'use server';
import { ChevronLeftSquare } from 'lucide-react';
import Link from 'next/link';
import { TextHeading } from '~/components';
import { Button, Sheet, SheetClose, SheetContent, SheetTrigger } from '~/components/ui';

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <ChevronLeftSquare size={30} />
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col py-4 gap-1">
          <SheetClose asChild>
            <Link href="/login" className="border-[1px] rounded-sm h-10 flex justify-center items-center">
              <TextHeading heading="Log In" className="italic text-2xl" />
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/signup" className="border-[1px] rounded-sm h-10 flex justify-center items-center">
              <TextHeading heading="Sign Up" className="italic text-2xl" />
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
