import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export function BackToAllTagsLink() {
  return (
    <Link href={'/tags'}>
      <div className="flex flex-row">
        <ChevronLeft className="text-primary" />
        <p className="text-primary hover:underline">Back to all tags...</p>
      </div>
    </Link>
  );
}
