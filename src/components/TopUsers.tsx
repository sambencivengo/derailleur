import { Info } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '~/components/ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { DerailleurResponse, createSuccessfulResponse, createErrorResponse, createDerailleurError } from '~/utils';
import prisma from '~prisma/prisma';

const lastMonth = moment().subtract(14, 'days').toDate();
interface UsersByLikes {
  id: string;
  username: string;
  total_likes: BigInt;
}

export async function TopUsers() {
  const { errors, result } = await getTopUsers();
  if (errors.length > 0 || result === null) {
    return null;
  }
  return (
    <Card className="w-full max-w-52 bg-background">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <CardHeader className="hover:text-primary">
              <div className="flex flex-row items-center gap-2">
                <CardTitle className="text-xl text-center">
                  <p>Top Contributors</p>
                </CardTitle>
                <Info size={15} />
              </div>
            </CardHeader>
          </TooltipTrigger>
          <TooltipContent>
            <p>Based on likes received in the last month</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator />
      <CardContent className="flex flex-col gap-1">
        {result.map((user) => {
          const { id, username } = user;
          return (
            <Card key={id} className="border-0 bg-background shadow-none">
              <CardHeader className="p-2">
                <Link className="hover:text-primary" href={`/user/${username}`}>
                  <p className="font-semibold truncate">{username}</p>
                </Link>
              </CardHeader>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
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
