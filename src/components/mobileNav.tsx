'use client';
import React from 'react';
import { ChevronLeftSquare } from 'lucide-react';
import { LogInButton } from '~/components/logInButton';
import { LogOutButton } from '~/components/logOutButton';
import { NewPostButton } from '~/components/newPostButton';
import { SignUpButton } from '~/components/signUpButton';
import { ToggleDarkModeButton } from '~/components/toggleDarkModeButton';
import { MobileAddPostButton } from '~/components/mobileAddPostButton';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '~/components/ui';
import { UserProfileButton } from '~/components/userProfileButton';
import { UserAndSession } from '~/types';

interface MobileNavProps {
  user: UserAndSession | null;
}
export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  function setOpenState(state: boolean = false) {
    setIsOpen(state);
  }

  return (
    <div className="flex md:hidden gap-2">
      <MobileAddPostButton />
      <Sheet open={isOpen}>
        <SheetTrigger onClick={() => setIsOpen(true)}>
          <ChevronLeftSquare size={30} />
        </SheetTrigger>
        <SheetContent setOpenState={setOpenState} className="pt-10">
          <div className="flex flex-col justify-between h-full py-4 ">
            <div className="flex flex-col gap-4">
              {user !== null ? (
                <>
                  <SheetClose onClick={() => setIsOpen(false)}>
                    <NewPostButton forMobile={true} />
                  </SheetClose>
                  <SheetClose onClick={() => setIsOpen(false)}>
                    <UserProfileButton userName={user.username} userId={user.userId} forMobile={true} />
                  </SheetClose>
                  <SheetClose>
                    <LogOutButton setOpenState={setOpenState} />
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose onClick={() => setIsOpen(false)}>
                    <LogInButton />
                  </SheetClose>
                  <SheetClose onClick={() => setIsOpen(false)}>
                    <SignUpButton forMobile={true} />
                  </SheetClose>
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
}
