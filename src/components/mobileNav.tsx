'use server';
import { ChevronLeftSquare } from 'lucide-react';
import Link from 'next/link';
import { TextHeading, ToggleDarkModeButton } from '~/components';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '~/components/ui';

export const MobileNav = () => {
  return (
    <div className="flex md:hidden pr-2">
      <Sheet>
        <SheetTrigger>
          <ChevronLeftSquare size={30} />
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col justify-between  h-full py-4 ">
            <div className="flex flex-col gap-1">
              <SheetClose asChild>
                <Link href="/login" className="border-[1px] border-primary rounded-sm h-10 flex justify-center items-center">
                  <TextHeading heading="Log In" className="italic text-2xl" />
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/signup" className="border-[1px] border-primary rounded-sm h-10 flex justify-center items-center">
                  <TextHeading heading="Sign Up" className="italic text-2xl" />
                </Link>
              </SheetClose>
            </div>
            <div className="w-full flex justify-end">
              <ToggleDarkModeButton />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
