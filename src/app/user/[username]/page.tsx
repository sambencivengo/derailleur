import { QueryError, TextHeading } from '~/components';
import { Badge, Card, CardContent, CardHeader, Separator } from '~/components/ui';
import { getUserByUsername } from '~/queries';

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = params;

  const { errors, result } = await getUserByUsername(username);

  // function getCityState() {
  //   navigator.geolocation.getCurrentPosition(
  //     (position: GeolocationPosition) => {
  //       const { longitude, latitude } = position.coords;

  //       console.log('Your current position is:');
  //       console.log(`Latitude : ${latitude}`);
  //       console.log(`Longitude: ${longitude}`);
  //     },
  //     (e: GeolocationPositionError) => {
  //       return e;
  //     }
  //   );
  // }
  if (result === null || errors.length > 0) {
    return <QueryError errors={errors} />;
  } else {
    return (
      <div className="flex flex-col mt-5 gap-2">
        <Card>
          <CardHeader>
            <TextHeading heading={'Profile'} />
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              <li>
                <p className="text-lg font-semibold">Favorite Bike:</p>
                <Separator />
              </li>
              <li>
                <Badge variant={'secondary'}>{result.favoriteBike}</Badge>
              </li>
              <li>
                <p className="text-lg font-semibold">Location:</p>
                <Separator />
              </li>
              <li>{result.location}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }
}
