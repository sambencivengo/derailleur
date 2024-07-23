import { PostCategory } from '@prisma/client';
import { QueryError } from '~/components/queryError';

const ROUTE_BASE = 'https://ridewithgps.com/routes/';
const TRIP_BASE = 'https://ridewithgps.com/trips/';

export function RideWithGPSIFrame({ url, category }: { url: string; category: PostCategory }) {
  let base: string = '';
  let type: 'routes' | 'trip' | '' = '';
  if (category === PostCategory.ROUTE) {
    base = ROUTE_BASE;
    type = 'routes';
  } else if (category === PostCategory.TRIP) {
    base = TRIP_BASE;
    type = 'trip';
  }
  const extractedRouteNumber = extractRideWithGpsRouteId(url, base);

  if (!Number(extractedRouteNumber) || Number(extractedRouteNumber) <= 0) {
    return <QueryError errors={[{ data: url, message: `Unable to create embedded route. There may be an issue with your share link: ${url}` }]} />;
  } else {
    return <iframe src={`https://ridewithgps.com/embeds?type=${type}&id=${extractedRouteNumber}&sampleGraph=true`} className="rounded-lg w-[1px] min-w-full h-[600px] border-0 overflow-hidden" />;
  }
}

function extractRideWithGpsRouteId(url: string, base: string) {
  const urlWithoutLastBackSlash = url[url.length - 1] === '/' ? url.slice(0, url.length - 1) : url;
  const splitURL = urlWithoutLastBackSlash.split(base);
  const extractedId = splitURL[1];
  return extractedId;
}
