import Link from 'next/link';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '~/components/ui';

const arrayOfCardTitles = new Array(9).fill(null).map((_, idx) => {
  return (
    <CardTitle key={idx} className="w-full italic">
      WELCOME TO DERAILLEUR
    </CardTitle>
  );
});
export function WelcomeCard() {
  return (
    <Card className="w-full bg-secondary-background overflow-hidden">
      <CardHeader className="overflow-hidden px-0">
        <div className="overflow-hidden items-center flex flex-row bg-primary gap-4 group">
          <div className="items-center flex flex-row  whitespace-nowrap animate-marquee gap-4 group-hover:paused">{arrayOfCardTitles}</div>
          <div className="items-center flex flex-row whitespace-nowrap aria-hidden:true animate-marquee2 gap-4 group-hover:paused" aria-hidden="true">
            {arrayOfCardTitles}
          </div>
        </div>
        <CardDescription className="text-center">A forum for bikepacking, xbiking, bike touring, and so much more...</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p>As a user, you can create posts about your bike, a trip you recently went on, ask or talk about general cycling related topics, and even share a Ride With GPS route for feedback or just to show off!</p>
      </CardContent>
      <CardContent className="text-center">
        <p>
          If you don't have an account, head to the{' '}
          <Link href="/signup" className="text-primary underline">
            sign up
          </Link>{' '}
          page and get started!
        </p>
        <p>
          Otherwise,{' '}
          <Link href="/login" className="text-primary underline">
            log in
          </Link>{' '}
          and join the discussion!
        </p>
      </CardContent>
    </Card>
  );
}
