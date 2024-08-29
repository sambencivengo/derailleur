import moment from 'moment';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '~/components/ui';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse, createDerailleurError } from '~/utils';
import prisma from '~prisma/prisma';

const lastMonth = moment().subtract(14, 'days').toDate();
interface UsersByLikes {
  id: string;
  username: string;
  total_likes: BigInt;
}

async function getTopUsers(): Promise<DerailleurResponse<UsersByLikes[]>> {
  'use server';
  try {
    const query: UsersByLikes[] = await prisma.$queryRaw`
    SELECT u."id", u."username", COUNT(ulp."id") AS total_likes
    FROM "User" u
    JOIN "Post" p ON u."id" = p."authorId"
    JOIN "UserLikedPosts" ulp ON p.id = ulp."postId"
    WHERE p."createdAt" > ${lastMonth}
    GROUP BY u."id", u."username"
    ORDER BY total_likes DESC
    LIMIT 10;
    `;
    return createSuccessfulResponse(query);
  } catch (error) {
    return createErrorResponse([createDerailleurError('Unable to get top users', {})]);
  }
}

export async function RightSideLayoutContainer() {
  return <div className="hidden md:flex flex-col items-center px-5 w-3/12">{<TopUsers />}</div>;
}
export async function TopUsers() {
  const { errors, result } = await getTopUsers();
  if (errors.length > 0 || result === null) {
    return null;
  }
  return (
    <Card className="w-full max-w-52 p-2">
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-1">
        {result.length > 0 &&
          result.map((user, idx) => {
            const { id, username } = user;
            return (
              <Card key={idx} className="border-0 shadow-none">
                <CardHeader className="p-2">
                  <Link className="hover:text-primary" href={`/user/${id}`}>
                    <CardTitle className="text-base flex flex-row truncate min-w-0">{username}</CardTitle>
                  </Link>
                </CardHeader>
              </Card>
            );
          })}
      </CardContent>
    </Card>
  );
}
