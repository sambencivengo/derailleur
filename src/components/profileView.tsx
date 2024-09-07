'use client';
import React from 'react';
import { TextHeading } from '~/components/textHeading';
import { Badge, Button, Card, CardContent, CardHeader, Separator } from '~/components/ui';
import { UserAndSession, UserWithHashedPassword } from '~/types';

// export function EditProfileForm({ result }: { result: UserWithHashedPassword }) {}

interface ProfileViewProps {
  result: UserWithHashedPassword;
  user: UserAndSession | null;
}
export function ProfileView({ result, user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  // const form = useForm();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <TextHeading heading={'Profile'} />{' '}
        <Button variant={'secondary'} size={'sm'} onClick={() => setIsEditing((prev) => !prev)}>
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div> form here</div>
        ) : (
          <ul className="flex flex-col gap-2">
            <li>
              <p className="text-lg font-semibold">Favorite Bike:</p>
              <Separator />
            </li>
            <li>
              <Badge variant={'secondary'}>{result.favoriteBike}</Badge>
            </li>
            <li>
              <p className="text-lg font-semibold">Location:</p>
              <Separator />
            </li>
            <li>{result.location}</li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
