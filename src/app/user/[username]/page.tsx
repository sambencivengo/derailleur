import React from 'react';
import { getUserSession } from '~/auth';
import { QueryError } from '~/components';
import { ProfileView } from '~/components/profileView';
import { getUserByUsername } from '~/queries';

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await getUserSession();

  const { errors, result } = await getUserByUsername(username);

  if (result === null || errors.length > 0) {
    return <QueryError errors={errors} />;
  } else {
    return (
      <div className="flex flex-col mt-5 gap-2">
        <ProfileView userProfile={result} user={user} />
      </div>
    );
  }
}
