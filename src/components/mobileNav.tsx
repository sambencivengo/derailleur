'use server';
import { ChevronLeftSquare } from 'lucide-react';
import { LogInButton, LogOutButton, NewPostButton, SignUpButton, ToggleDarkModeButton } from '~/components';
import { MobileAddPostButton } from '~/components/mobileAddPostButton';
import { Separator, Sheet, SheetClose, SheetContent, SheetTrigger } from '~/components/ui';
import { UserProfileButton } from '~/components/userProfileButton';
import { UserAndSession } from '~/types';

interface MobileNavProps {
  user: UserAndSession | null;
}
export const MobileNav = ({ user }: MobileNavProps) => {
  return (
    <div className="flex md:hidden pr-2 gap-2">
      <MobileAddPostButton />
      <Sheet>
        <SheetTrigger>
          <ChevronLeftSquare size={30} />
        </SheetTrigger>
        <SheetContent className="pt-10">
          <div className="flex flex-col justify-between  h-full py-4 ">
            <div className="flex flex-col gap-1">
              {user !== null ? (
                <>
                  <SheetClose asChild>
                    <UserProfileButton userName={user.username} forMobile={true} />
                  </SheetClose>
                  <Separator className="bg-primary" />
                  <SheetClose asChild>
                    <NewPostButton forMobile={true} />
                  </SheetClose>
                  <Separator className="bg-primary" />
                  <SheetClose asChild>
                    <LogOutButton forMobile={true} />
                  </SheetClose>
                  <Separator className="bg-primary" />
                </>
              ) : (
                <>
                  <Separator className="bg-primary" />
                  <SheetClose asChild>
                    <LogInButton forMobile={true} />
                  </SheetClose>
                  <Separator className="bg-primary" />
                  <SheetClose asChild>
                    <SignUpButton forMobile={true} />
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
