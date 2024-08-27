'use server';
import { LogOutButton, NewPostButton, LogInButton, SignUpButton, ToggleDarkModeButton } from '~/components';
import { UserProfileButton } from '~/components/userProfileButton';
import { UserAndSession } from '~/types';

interface DesktopNavProps {
  user: UserAndSession | null;
}
export async function DesktopNav({ user }: DesktopNavProps) {
  return (
    <div className="hidden md:flex gap-3">
      {user !== null ? (
        <div className="grid grid-flow-col content-center gap-3">
          <UserProfileButton userName={user.username} />
          <NewPostButton />
          <LogOutButton />
        </div>
      ) : (
        <div className="grid grid-flow-col content-center gap-3">
          <LogInButton />
          <SignUpButton />
        </div>
      )}
      <ToggleDarkModeButton />
    </div>
  );
}
