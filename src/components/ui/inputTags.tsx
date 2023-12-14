'use client';
import { Badge, XIcon } from 'lucide-react';
import React from 'react';
import { Dispatch, SetStateAction, forwardRef, useState } from 'react';
import { InputProps, Input, Button, Textarea } from '~/components/ui';

type InputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ value, onChange, ...props }, ref) => {
  const [pendingDataPoint, setPendingDataPoint] = React.useState('');
  const [focus, setFocus] = React.useState<boolean>(false);

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...value, pendingDataPoint]);
      onChange(Array.from(newDataPoints));
      setPendingDataPoint('');
    }
  };

  const [tags, setTags] = useState([]);

  function handleKeyDown(e) {
    // If user did not press enter key, return
    if (e.key !== 'Enter') return;
    // Get the value of the input
    const value = e.target.value;
    // If the value is empty, return
    if (!value.trim()) return;
    // Add the value to the tags array
    setTags([...tags, value]);
    // Clear the input
    e.target.value = '';
  }

  return (
    <div onClick={() => console.log('cliek')} className="flex cursor-text h-10 w-full rounded-md border bg-background px-3 py-2 border-input text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:focus-visible:-visible:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
      <input onFocus={() => setFocus(!focus)} className="flex-grow w-full rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
    </div>
  );
});
