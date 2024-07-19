import { QueryError } from '~/components/queryError';

export function RideWithGPSIFrame({ url }: { url: string }) {
  const extractedRouteNumber = extractRideWithGpsRouteId(url);
  if (!Number(extractedRouteNumber) || Number(extractedRouteNumber) <= 0) {
    return <QueryError errors={[{ data: url, message: `Unable to create embedded route. There may be an issue with your share link: ${url}` }]} />;
  } else {
    return <iframe src={`https://ridewithgps.com/embeds?type=route&id=${extractedRouteNumber}&sampleGraph=true`} className="rounded-lg w-[1px] min-w-full h-[600px] border-0 overflow-hidden" />;
  }
}

const ROUTE_BASE = 'https://ridewithgps.com/routes/';
function extractRideWithGpsRouteId(url: string) {
  const urlWithoutLastBackSlash = url[url.length - 1] === '/' ? url.slice(0, url.length - 1) : url;
  const splitURL = urlWithoutLastBackSlash.split(ROUTE_BASE);
  const extractedId = splitURL[1];
  return extractedId;
}
