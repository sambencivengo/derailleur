import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, PlusCircle } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FormWrapper } from '~/components/formWrapper';
import { FormField, FormItem, FormControl, Input, FormMessage, Button, Separator } from '~/components/ui';
import { updateUser } from '~/queries/users/updateUser';
import { editProfilePayloadSchema, EditProfilePayloadSchema } from '~/schemas/userSchemas';
import { UserProfile } from '~/types';
import { Spinner } from '~/components/spinner';
import { DerailleurError } from '~/utils';
import { QueryError } from '~/components/queryError';

interface EditProfileFormProps {
  userProfile: UserProfile;
  userId: string;
  updateUserProfileState: (userProfile: UserProfile) => void;
  updateEditingState: (isEditingState: boolean) => void;
}

export function EditProfileForm({ userProfile, userId, updateUserProfileState, updateEditingState }: EditProfileFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [queryErrors, setQueryErrors] = React.useState<Array<DerailleurError>>([]);
  const form = useForm<EditProfilePayloadSchema>({
    resolver: zodResolver(editProfilePayloadSchema),
    defaultValues: {
      favoriteBikes: userProfile.favoriteBikes.map((bike) => ({ bike })),
      location: userProfile.location ?? '',
    },
  });

  const { fields, remove, append } = useFieldArray({ name: 'favoriteBikes', control: form.control });

  async function onSubmit(values: EditProfilePayloadSchema) {
    setIsLoading(true);
    console.log('onSubmit:', values);

    const { errors, result } = await updateUser({ location: values.location, favoriteBikes: values.favoriteBikes.map(({ bike }) => bike) }, userId);

    if (errors.length > 0 || result === null) {
      setQueryErrors(errors);
    } else {
      updateEditingState(false);
      updateUserProfileState(result);
    }
    setIsLoading(false);
  }
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <ul className="flex flex-col gap-2 w-full">
        <li>
          <p className="text-lg font-semibold">Favorite Bikes:</p>
          <Separator />
        </li>
        <div className="w-full flex flex-col gap-2">
          {fields.map((field, index) => {
            return (
              <li key={field.id} className="w-full flex flex-row gap-2">
                <FormField
                  control={form.control}
                  name={`favoriteBikes.${index}.bike`}
                  render={({ field: bikeFiled }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Bike" {...bikeFiled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    remove(index);
                  }}
                  variant={'ghost'}
                  size={'icon'}
                >
                  <X />
                </Button>
              </li>
            );
          })}
          <div className="w-full flex justify-center">
            <Button
              variant={'secondary'}
              className="w-full sm:w-36 flex flex-row gap-2"
              size={'icon'}
              onClick={(e) => {
                append({ bike: '' });
                e.preventDefault();
              }}
            >
              Add a bike <PlusCircle />
            </Button>
          </div>
        </div>
        <li>
          <p className="text-lg font-semibold">Location:</p>
          <Separator />
        </li>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Brooklyn, New York" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {queryErrors.length > 0 && <QueryError errors={queryErrors} />}
        <div className="w-full flex justify-end">
          <Button type="submit">{isLoading ? <Spinner /> : 'Save'}</Button>
        </div>
      </ul>
    </FormWrapper>
  );
}

// NOTE: Google maps location
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
