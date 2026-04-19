import { headers } from 'next/headers';
import { auth } from '~/auth/auth';
import { QueryError } from '~/components/queryError';
import { ProfileView } from '~/components/profileView';
import { getUserByUsername } from '~/queries/users/getUserByUsername';

export default async function Page(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const { username } = params;
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user.username ? { id: session.user.id, username: session.user.username } : null;

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
