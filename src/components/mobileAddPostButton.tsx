'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui';

export function MobileAddPostButton() {
  const router = useRouter();
  return (
    <Button className="rounded-full transform bg-primary hover:bg-black h-8 w-8" onClick={() => router.push('/post/new')} size="icon">
      <Plus />
    </Button>
  );
}
