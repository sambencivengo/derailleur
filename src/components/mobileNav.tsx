'use client';
import { LogInButton } from '~/components/logInButton';
import { LogOutButton } from '~/components/logOutButton';
import { NewPostButton } from '~/components/newPostButton';
import { SignUpButton } from '~/components/signUpButton';
import { ToggleDarkModeButton } from '~/components/toggleDarkModeButton';
import { MobileAddPostButton } from '~/components/mobileAddPostButton';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '~/components/ui';
import { UserProfileButton } from '~/components/userProfileButton';
import { UserAndSession } from '~/types';
import { MenuButton } from './nav/menuButton';
import { useMenuState } from '~/hooks/useMenuState';

interface MobileNavProps {
  user: UserAndSession | null;
}
export function MobileNav({ user }: MobileNavProps) {
  const { isOpen, close, toggle } = useMenuState();

  return (
    <div className="flex md:hidden gap-2">
      <MobileAddPostButton />
      <Sheet open={isOpen}>
        <SheetTrigger asChild>
          <MenuButton onClick={toggle} />
        </SheetTrigger>
        <SheetContent setOpenState={close} className="pt-10">
          <div className="flex flex-col justify-between h-full py-4 ">
            <div className="flex flex-col gap-4">
              {user !== null ? (
                <>
                  <SheetClose onClick={close}>
                    <NewPostButton forMobile={true} />
                  </SheetClose>
                  <SheetClose onClick={close}>
                    <UserProfileButton userName={user.username} userId={user.id} forMobile={true} />
                  </SheetClose>
                  <SheetClose>
                    <LogOutButton setOpenState={close} />
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose onClick={close}>
                    <LogInButton />
                  </SheetClose>
                  <SheetClose onClick={close}>
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
