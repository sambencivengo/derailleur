'use client';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '~/components/ui';

type Inputs = {
  username: string;
  password: string;
};

export const NewForm: React.FC = () => {
  const [postError, setPostError] = React.useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errors: any = await response.text();
      console.log({ errors });
      setPostError(errors);
    }
  };
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 w-64">
        <input autoComplete="current-password" placeholder="username" {...register('username', { required: true })} />
        {errors.username && <span>This field is required</span>}

        <input autoComplete="current-password" type="password" placeholder="password" {...register('password', { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.password && <span>This field is required</span>}
        {postError.length !== 0 && <p className="text-red-500">{postError}</p>}
        <Button type="submit" className="w-24">
          Submit
        </Button>
      </div>
    </form>
  );
};
