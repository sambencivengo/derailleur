'use client';
import { PenBox } from 'lucide-react';
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
      <CardHeader className="flex space-y-0 flex-row w-full items-center justify-between gap-2">
        <TextHeading heading={'Profile'} />{' '}
        {user !== null && user.username === result.username && (
          <Button variant={'ghost'} size={'icon'} onClick={() => setIsEditing((prev) => !prev)}>
            <PenBox size={25} />
          </Button>
        )}
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
