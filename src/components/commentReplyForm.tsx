'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SubmittedCommentReply, SubmittedCommentReplyProps } from '~/components/comment';
import { FormWrapper } from '~/components/formWrapper';
import { QueryError } from '~/components/queryError';
import { Spinner } from '~/components/spinner';
import { Alert, AlertDescription, AlertTitle, Button, FormControl, FormField, FormItem, FormMessage, Textarea } from '~/components/ui';
import { createComment } from '~/queries';
import { CreateCommentPayload } from '~/types';
import { DerailleurError } from '~/utils';

export const createCommentSchema: z.ZodType<CreateCommentPayload> = z.object({
  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .min(10, {
      message: 'Comment must be at least 10 characters.',
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
  const [newReply, setNewReply] = React.useState<SubmittedCommentReplyProps | null>(null);

  const form = useForm<CreateCommentPayload>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: CreateCommentPayload) {
    setIsLoading(true);
    const response = await createComment(values, postId, userId ?? '', parentCommentId);
    const { errors, result } = response;
    if (errors.length > 0 || result === null) {
      setIsLoading(false);
      setSubmitCommentError(response.errors);
    } else {
      const {
        authorId,
        content,
        createdAt,
        parentCommentId,
        postId,
        author: { username },
      } = result;
      setNewReply({ content, createdAt, parentCommentId: parentCommentId!, userId: authorId, username, postId });
      setIsReplying(false);
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
      {newReply && <SubmittedCommentReply content={newReply.content} createdAt={newReply.createdAt} parentCommentId={newReply.parentCommentId} postId={newReply.postId} userId={newReply.userId} username={newReply.username} />}
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
            {submitCommentError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                {submitCommentError.map(({ message }) => {
                  return <AlertDescription key={message}></AlertDescription>;
                })}
              </Alert>
            )}
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
