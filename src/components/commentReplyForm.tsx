'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormWrapper } from '~/components/formWrapper';
import { QueryError } from '~/components/queryError';
import { Spinner } from '~/components/spinner';
import { Button, FormControl, FormField, FormItem, FormMessage, Textarea } from '~/components/ui';
import { createComment } from '~/queries';
import { CreateCommentPayload } from '~/types';
import { DerailleurError } from '~/utils';

export const createCommentSchema: z.ZodType<CreateCommentPayload> = z.object({
  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .trim(),
});

interface CommentReplyFormProps {
  postId: string;
  parentCommentId?: string;
  userId: string | null;
}
export function CommentReplyForm({ parentCommentId, postId, userId }: CommentReplyFormProps) {
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [submitCommentError, setSubmitCommentError] = React.useState<DerailleurError[] | null>(null);

  const form = useForm<CreateCommentPayload>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: CreateCommentPayload) {
    setIsLoading(true);
    const response = await createComment(values, postId, userId ?? '', parentCommentId);
    if (response.errors.length > 0 || response.result === null) {
      setIsLoading(false);
      setSubmitCommentError(response.errors);
    } else {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      {userId ? (
        <Button
          variant="link"
          className=""
          onClick={() => {
            userId ? setIsReplying(true) : redirect('/login');
          }}
        >
          Reply
        </Button>
      ) : (
        <Link href={userId ? '' : '/login'} className="text-primary hover:underline">
          Reply
        </Link>
      )}
      {isReplying && (
        <div className="w-full">
          <FormWrapper form={form} onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex">
              <Button type="submit">{isLoading ? <Spinner /> : 'Submit'}</Button>
            </div>
          </FormWrapper>
          {submitCommentError && <QueryError errors={submitCommentError} />}
        </div>
      )}
    </div>
  );
}
