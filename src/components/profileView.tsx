'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PenBox, PlusCircle } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { TextHeading } from '~/components/textHeading';
import { Badge, Button, Card, CardContent, CardHeader, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Separator } from '~/components/ui';
import { UserAndSession, UserWithHashedPassword } from '~/types';
import { FormWrapper } from '~/components/formWrapper';
import { editProfilePayloadSchema, EditProfilePayloadSchema } from '~/schemas/userSchemas';

// export function EditProfileForm({ result }: { result: UserWithHashedPassword }) {}

interface ProfileViewProps {
  result: UserWithHashedPassword;
  user: UserAndSession | null;
}
export function ProfileView({ result, user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  // const form = useForm();
  return (
    <Card>
      <CardHeader className="flex space-y-0 flex-row w-full items-center justify-between gap-2">
        <TextHeading heading={'Profile'} />{' '}
        {user !== null && user.username === result.username && (
          <Button variant={'ghost'} size={'icon'} onClick={() => setIsEditing((prev) => !prev)}>
            <PenBox size={25} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <EditProfileForm result={result} />
        ) : (
          <ul className="flex flex-col gap-2">
            <li>
              <p className="text-lg font-semibold">Favorite Bike:</p>
              <Separator />
            </li>
            <li>
              <Badge variant={'secondary'}>{result.favoriteBikes}</Badge>
            </li>
            <li>
              <p className="text-lg font-semibold">Location:</p>
              <Separator />
            </li>
            <li>{result.location}</li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function EditProfileForm({ result }: { result: UserWithHashedPassword }) {
  const form = useForm<EditProfilePayloadSchema>({
    resolver: zodResolver(editProfilePayloadSchema),
    defaultValues: {
      favoriteBikes: [],
      location: '',
    },
  });

  const { fields, append } = useFieldArray({ name: 'favoriteBikes', control: form.control });
  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
  //   nam
  //   control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
  // });

  async function onSubmit(values: EditProfilePayloadSchema) {
    console.log('onSubmit:', values);
  }
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <ul className="flex flex-col gap-2 w-full">
        <li className="flex flex-row items-center w-full justify-between">
          <p className="text-lg font-semibold">Favorite Bike:</p>

          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={() => {
              append({ bike: '' });
            }}
          >
            <PlusCircle />
          </Button>
        </li>
        <Separator />
        <div className="flex flex-col gap-2">
          <li>
            {fields.map((field, index) => {
              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`favoriteBikes.${index}.bike`}
                  render={({ field: bikeFiled }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Bike" {...bikeFiled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </li>
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
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </ul>
    </FormWrapper>
  );
}
