'use client';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { PenBox, X } from 'lucide-react';
import { TextHeading } from '~/components/textHeading';
import { Badge, Button, Card, CardContent, CardHeader, Separator } from '~/components/ui';
import { UserAndSession, UserProfile } from '~/types';
import { EditProfileForm } from '~/components/editProfileForm';

interface ProfileViewProps {
  userProfile: UserProfile;
  user: UserAndSession | null;
}
export function ProfileView({ userProfile, user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [userProfileState, setUserProfileState] = React.useState<UserProfile>(userProfile);

  const userIsLoggedIn = user !== null && user.username === userProfile.username;

  function updateUserProfileState(userProfileState: UserProfile): void {
    console.log(userProfileState);
    setUserProfileState(userProfileState);
  }
  function updateEditingState(isEditingState: boolean): void {
    setIsEditing(isEditingState);
  }

  console.log('#@###', userProfileState.location);
  return (
    <Card>
      <CardHeader className="flex space-y-0 flex-row w-full items-center justify-between gap-2">
        <TextHeading heading={'Profile'} />{' '}
        {userIsLoggedIn && (
          <Button variant={'ghost'} size={'icon'} onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? <X size={25} /> : <PenBox size={25} />}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing && userIsLoggedIn ? (
          <EditProfileForm updateEditingState={updateEditingState} userProfile={userProfileState} updateUserProfileState={updateUserProfileState} userId={user.userId} />
        ) : (
          <ul className="w-full flex flex-col gap-2">
            <li>
              <p className="text-lg font-semibold">Favorite Bikes:</p>
              <Separator />
            </li>
            <li className="w-full flex flex-wrap gap-2">
              {userProfileState.favoriteBikes.length > 0 ? (
                userProfileState.favoriteBikes.map((bike) => (
                  <Badge key={uuid()} variant={'secondary'}>
                    {bike}
                  </Badge>
                ))
              ) : (
                <div>
                  {userIsLoggedIn ? (
                    <Button size={'sm'} variant={'secondary'} onClick={() => setIsEditing(true)}>
                      Add bikes
                    </Button>
                  ) : (
                    <p>{userProfileState.username} hasn't added any favorite bikes</p>
                  )}
                </div>
              )}
            </li>
            <li>
              <p className="text-lg font-semibold">Location:</p>
              <Separator />
            </li>
            <li>
              {userProfileState.location !== null ? (
                <Badge variant={'secondary'}>{userProfileState.location}</Badge>
              ) : userIsLoggedIn ? (
                <Button size={'sm'} variant={'secondary'} onClick={() => setIsEditing(true)}>
                  Add your location
                </Button>
              ) : (
                <p>{userProfileState.username} hasn't added their location</p>
              )}
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
