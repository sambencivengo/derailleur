'use client';

import Link from 'next/link';
import { Badge } from '~/components/ui/badge';

export function RouteTag({ route }: { route: string | null }) {
  return (
    route !== null && (
      <Link href={`/tags/route`}>
        <Badge variant={'default'}>{'ROUTE'}</Badge>
      </Link>
    )
  );
}
