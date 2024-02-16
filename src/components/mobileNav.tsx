'use server';
import { ChevronLeftSquare } from 'lucide-react';
import Link from 'next/link';
import { LogInButton, LogOutButton, NewPostButton, TextHeading, ToggleDarkModeButton } from '~/components';
import { Separator, Sheet, SheetClose, SheetContent, SheetTrigger } from '~/components/ui';
import { UserAndSession } from '~/types';

interface MobileNavProps {
  user: UserAndSession | null;
}
export const MobileNav = ({ user }: MobileNavProps) => {
  return (
    <div className="flex md:hidden pr-2">
      <Sheet>
        <SheetTrigger>
          <ChevronLeftSquare size={30} />
        </SheetTrigger>
        <SheetContent className="pt-10">
          <div className="flex flex-col justify-between  h-full py-4 ">
            <div className="flex flex-col gap-1">
              {user ? (
                <>
                  <SheetClose asChild>
                    <NewPostButton forMobile={true} />
                  </SheetClose>
                  <SheetClose asChild>
                    <LogOutButton forMobile={true} />
                  </SheetClose>
                </>
              ) : (
                <>
                  <Separator className="bg-primary" />
                  <SheetClose asChild>
                    <LogInButton forMobile={true} />
                  </SheetClose>
                  <Separator className="bg-primary" />
                  <SheetClose asChild>
                    <Link href="/signup" className="rounded-sm h-10 flex justify-center items-center">
                      <TextHeading heading="Sign Up" className="italic text-2xl" />
                    </Link>
                  </SheetClose>
                  <Separator className="bg-primary" />
                </>
              )}
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
