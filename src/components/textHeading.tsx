'use server';

import { cn } from '~/lib/utils';

interface HeadingProps {
  heading: string;
  className?: string;
  italicAnimate?: boolean;
}
export const TextHeading = ({ heading, className, italicAnimate = false }: HeadingProps) => {
  const headingLetters = italicAnimate
    ? heading.split('').map((letter) => {
        return <p className="hover:italic">{letter}</p>;
      })
    : heading;
  return <div className={cn('text-xl font-bold flex flex-row', italicAnimate ? 'hover:bg-primary' : '', className)}>{headingLetters}</div>;
};
