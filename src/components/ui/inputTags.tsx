'use client';
import React from 'react';
import { XIcon } from 'lucide-react';
import { Dispatch, SetStateAction, forwardRef, useState } from 'react';
import { InputProps, Input, Button, Textarea, Badge } from '~/components/ui';

type InputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ type, value, onChange, ...props }, ref) => {
  const [pendingDataPoint, setPendingDataPoint] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  // const addPendingDataPoint = () => {
  //   if (pendingDataPoint) {
  //     const newDataPoints = new Set([...value, pendingDataPoint]);
  //     onChange(Array.from(newDataPoints));
  //     setPendingDataPoint('');
  //   }
  // };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // If user did not press enter key, return
    if (e.key !== 'Enter') {
      return;
    }
    // Get the value of the input
    // If the value is empty, return
    // Add the value to the tags array
    setTags([...tags, value]);
    // Clear the input
    e.target.value = '';
  }
  return (
    <div className="flex gap-2 cursor-text h-10 w-full rounded-md border bg-background px-3 py-2 border-input text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:focus-visible:-visible:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
      {/* {tags.map((tag, index) => (
        <div className="tag-item" key={index}>
          <span className="text">{tag}</span>
          <span className="close">&times;</span>
        </div>
      ))}
      <input onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder="Type somthing" />
       */}
      {/* <Textarea> */}
      {/* </Textarea> */}
      <div className="flex flex-row gap-2">
        <Badge variant="secondary">
          <p className="whitespace-nowrap">Trip Report</p> <XIcon size="16" />
        </Badge>
        <Badge variant="secondary">
          <p className="whitespace-nowrap">Other Tag</p> <XIcon size="16" />
        </Badge>
        <Badge variant="secondary">
          <p className="whitespace-nowrap"> #Rig </p> <XIcon size="16" />
        </Badge>
        <Badge variant="secondary">
          <p className="whitespace-nowrap"> Bridgestone </p>
          <XIcon size="16" />
        </Badge>
      </div>
      <input type={type} ref={ref} onChange={onChange} onKeyDown={(e) => handleKeyDown} {...props} className="flex-grow w-full rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
    </div>
  );
});
