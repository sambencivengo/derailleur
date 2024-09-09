import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle, Button } from '~/components/ui';

const arrayOfCardTitles = new Array(9).fill(null).map((_, idx) => {
  return (
    <CardTitle key={idx} className="w-full text-3xl italic">
      WELCOME TO DERAILLEUR
    </CardTitle>
  );
});
export function WelcomeCard() {
  return (
    <Card className="w-full overflow-hidden border-primary border-2">
      <CardHeader className="overflow-hidden px-0">
        <div className="overflow-hidden items-center flex flex-row bg-primary gap-28 group">
          <div className="items-center flex flex-row  whitespace-nowrap animate-marquee gap-28 group-hover:paused">{arrayOfCardTitles}</div>
          <div className="items-center flex flex-row whitespace-nowrap aria-hidden:true animate-marquee2 gap-28 group-hover:paused" aria-hidden="true">
            {arrayOfCardTitles}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-center text-xl">
        <p>Derailleur is place for bike enthusiasts to come together to discuss their passion for cycling, share routes and rides, plan bikepacking trips and more. Join the discussion!</p>
      </CardContent>

      <CardContent className="flex flex-row justify-center w-full gap-5">
        <Link href="/signup">
          <Button className="font-bold">Create account</Button>
        </Link>
        <Link href="/login">
          <Button className="text-primary font-bold hover:text-primary hover:bg-transparent" variant={'ghost'}>
            Log in
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
